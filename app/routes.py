# app/routes.py
from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import current_user, login_user, logout_user, login_required
from app.models import User, Student, Parent, Teacher, Test, Question, Option, TestResult
from app import db
from werkzeug.urls import url_parse
from .forms import RegistrationForm
from .chatbot import get_response
bp = Blueprint('routes', __name__)

@bp.route('/')
def index():
    return render_template('index.html', title="Home")

@bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        role = request.form.get('role')
        parent_username = request.form.get('parent_username') if role == 'student' else None
        parent_password = request.form.get('parent_password') if role == 'student' else None

        # Check if the username already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash('Username already exists. Please choose a different one.', 'danger')
            return redirect(url_for('routes.register'))

        # Create a new user with hashed password
        new_user = User(username=username, role=role)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()  # Commit here to ensure the new_user.id is generated

        if role == 'student':
            # Check if the parent already exists
            parent_user = User.query.filter_by(username=parent_username).first()
            if not parent_user:
                parent_user = User(username=parent_username, role='parent')
                parent_user.set_password(parent_password)
                db.session.add(parent_user)
                db.session.commit()  # Commit to generate parent_user.id

                parent = Parent(user_id=parent_user.id)
                db.session.add(parent)
                db.session.commit()  # Commit to generate parent.id

            else:
                # Use the existing parent record
                parent = Parent.query.filter_by(user_id=parent_user.id).first()  # Get the Parent instance

            # Create a student record linked to the parent
            student = Student(name=username, user_id=new_user.id, parent_id=parent.id)
            db.session.add(student)
            db.session.commit()

        elif role == 'teacher':
            # Create a teacher record
            teacher = Teacher(user_id=new_user.id)  # Use new_user.id here
            db.session.add(teacher)
            db.session.commit()

        flash('Registration successful! Please log in.', 'success')
        return redirect(url_for('routes.login'))

    return render_template('register.html', title='Register')




@bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('routes.index'))
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user is None or not user.check_password(password):
            flash('Invalid username or password')
            return redirect(url_for('routes.login'))
        login_user(user)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            if user.role == 'student':
                next_page = url_for('routes.student_dashboard')
            elif user.role == 'parent':
                next_page = url_for('routes.parent_dashboard', parent_id=user.parent.id)
            elif user.role == 'teacher':
                next_page = url_for('routes.teacher_dashboard')
            else:
                next_page = url_for('routes.index')
        return redirect(next_page)
    return render_template('login.html', title="Login")

@bp.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('routes.index'))

# Student Routes
@bp.route('/student/dashboard')
@login_required
def student_dashboard():
    if current_user.role != 'student':
        flash('Access denied.')
        return redirect(url_for('routes.index'))
    student = current_user.student
    previous_results = TestResult.query.filter_by(student_id=student.id).all()
    average_score = db.session.query(db.func.avg(TestResult.score)).filter_by(student_id=student.id).scalar() or 0
    ongoing_test = Test.query.order_by(Test.date_created.desc()).first()  # Simplistic ongoing test logic
    return render_template('student_dashboard.html', 
                           title="Student Dashboard",
                           previous_results=previous_results,
                           average_score=round(average_score, 2),
                           ongoing_test=ongoing_test)

@bp.route('/student/test/<test_id>', methods=['GET', 'POST'])
@login_required
def student_test(test_id):
    if current_user.role != 'student':
        flash('Access denied.')
        return redirect(url_for('routes.index'))
    test = Test.query.get_or_404(test_id)
    if request.method == 'POST':
        total_questions = len(test.questions)
        correct_answers = 0
        for question in test.questions:
            selected_option_id = request.form.get(f'question_{question.id}')
            if selected_option_id:
                selected_option = Option.query.get(selected_option_id)
                if selected_option and selected_option.is_correct:
                    correct_answers += 1
        score = (correct_answers / total_questions) * 100
        # Save test result
        test_result = TestResult(student_id=current_user.student.id, test_id=test.id, score=score)
        db.session.add(test_result)
        db.session.commit()
        flash(f'Test submitted! Your score: {score:.2f}/100')
        return redirect(url_for('routes.student_dashboard'))
    return render_template('test_page.html', title="Take Test", test=test)

# Parent Routes
@bp.route('/parent/dashboard/<parent_id>')
@login_required
def parent_dashboard(parent_id):
    print(parent_id)
    print(current_user.parent.id,parent_id)
    if current_user.role != 'parent' or current_user.parent.id != parent_id:
        flash('Access denied.')
        return redirect(url_for('routes.index'))
    parent = Parent.query.get(parent_id)
    students = parent.students
    print("In Parent:",students)
    student_data = []
    for student in students:
        test_results = TestResult.query.filter_by(student_id=student.id).all()
        average_score = db.session.query(db.func.avg(TestResult.score)).filter_by(student_id=student.id).scalar() or 0
        # Calculate class rank for each test
        rank_data = []
        for result in test_results:
            same_test_results = TestResult.query.filter_by(test_id=result.test_id).order_by(TestResult.score.desc()).all()
            rank = same_test_results.index(result) + 1 if result in same_test_results else 'N/A'
            rank_data.append({'test_name': result.test.name, 'score': result.score, 'class_average': db.session.query(db.func.avg(TestResult.score)).filter_by(test_id=result.test_id).scalar() or 0, 'rank': rank})
        student_data.append({'name': student.name, 'average_score': round(average_score, 2), 'rank_data': rank_data})
    return render_template('parent_dashboard.html', title="Parent Dashboard", students=student_data)

# Teacher Routes
@bp.route('/teacher/dashboard')
@login_required
def teacher_dashboard():
    if current_user.role != 'teacher':
        flash('Access denied.')
        return redirect(url_for('routes.index'))
    teacher = current_user.teacher
    tests = teacher.tests
    test_data = []
    for test in tests:
        average_score = db.session.query(db.func.avg(TestResult.score)).filter_by(test_id=test.id).scalar() or 0
        test_data.append({'name': test.name, 'average_score': round(average_score, 2)})
    previous_tests = tests
    return render_template('teacher_dashboard.html', title="Teacher Dashboard", tests=test_data, previous_tests=previous_tests)

@bp.route('/teacher/create_test', methods=['GET', 'POST'])
@login_required
def create_test():
    if current_user.role != 'teacher':
        flash('Access denied.')
        return redirect(url_for('routes.index'))
    if request.method == 'POST':
        test_name = request.form['test_name']
        test = Test(name=test_name, teacher_id=current_user.teacher.id)
        db.session.add(test)
        db.session.commit()
        
        # Handle dynamic questions
        total_questions = int(request.form['total_questions'])
        for i in range(total_questions):
            question_text = request.form.get(f'question_{i}')
            option_1 = request.form.get(f'option_{i}_1')
            option_2 = request.form.get(f'option_{i}_2')
            option_3 = request.form.get(f'option_{i}_3')
            option_4 = request.form.get(f'option_{i}_4')
            correct_answer = request.form.get(f'answer_{i}')
            
            question = Question(text=question_text, test_id=test.id)
            db.session.add(question)
            db.session.commit()
            
            # Add options
            options = [option_1, option_2, option_3, option_4]
            for option_text in options:
                is_correct = (option_text == correct_answer)
                option = Option(text=option_text, is_correct=is_correct, question_id=question.id)
                db.session.add(option)
            db.session.commit()
        
        flash('Test created successfully!')
        return redirect(url_for('routes.teacher_dashboard'))
    return render_template('create_test.html', title="Create Test")

@bp.route('/teacher/view_test/<test_id>')
@login_required
def view_test(test_id):
    if current_user.role != 'teacher':
        flash('Access denied.')
        return redirect(url_for('routes.index'))
    test = Test.query.get_or_404(test_id)
    return render_template('view_test.html', title="View Test", test=test)

# Chatbot Route
@bp.route('/chatbot', methods=['POST'])
@login_required
def chatbot():
    if current_user.role != 'student':
        return "Access denied.", 403
    user_input = request.form.get('message')
    # Placeholder response
    response = get_response(user_input)
    return response
