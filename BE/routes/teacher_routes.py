from flask import Blueprint, request, jsonify
from models import Teacher, Class, Category, Test, Question, Option, PerformanceReport, Feedback, Student ,User, Parent
from extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

teacher_bp = Blueprint('teacher_bp', __name__, url_prefix='/api/teachers')

def is_authorized_teacher(teacher_id):
    identity = get_jwt_identity()
    return identity['user_id'] == teacher_id and identity['role'] == 'Teacher'

@teacher_bp.route('/<int:teacher_id>/classes', methods=['GET'])
@jwt_required()
def get_classes(teacher_id):
    if not is_authorized_teacher(teacher_id):
        return jsonify({'message': 'Unauthorized'}), 403

    classes = Class.query.filter_by(teacher_id=teacher_id).all()
    classes_data = [
        {
            'class_id': class_obj.class_id,
            'class_name': class_obj.class_name,
            'categories': [
                {
                    'category_id': category.category_id,
                    'category_name': category.category_name
                } for category in class_obj.categories
            ]
        }
        for class_obj in classes
    ]

    return jsonify({'classes': classes_data}), 200
@teacher_bp.route('/<int:teacher_id>/enrolled_students', methods=['GET'])
@jwt_required()
def get_students_enrolled(teacher_id):
    if not is_authorized_teacher(teacher_id):
        return jsonify({'message': 'Unauthorized'}), 403
    arr=[]
    for i in Teacher.query.filter_by(teacher_id=teacher_id).first().classes:
        for j in i.students:
            student_user=User.query.filter_by(user_id=j.student_id).first()
            arr.append({'student_name':student_user.username,'student_id':student_user.user_id})
    return jsonify({'students': arr}), 200

@teacher_bp.route('/<int:teacher_id>/enrolled_parents', methods=['GET'])
@jwt_required()
def get_parents_enrolled(teacher_id):
    if not is_authorized_teacher(teacher_id):
        return jsonify({'message': 'Unauthorized'}), 403
    arr=[]
    for i in Teacher.query.filter_by(teacher_id=teacher_id).first().classes:
        for j in i.students:
            parent_email=Student.query.filter_by(student_id=j.student_id).first().parent_email
            parent_user=User.query.filter_by(email=parent_email).first()
            arr.append({'parent_name':parent_user.username,'parent_id':parent_user.user_id})
    return jsonify({'parents': arr}), 200

@teacher_bp.route('/<int:teacher_id>/feedback', methods=['GET'])
@jwt_required()
def get_sent_feedback(teacher_id):
    if not is_authorized_teacher(teacher_id):
        return jsonify({'message': 'Unauthorized'}), 403

    feedbacks = Feedback.query.filter_by(from_user_id=teacher_id).all()
    feedback_data = [
        {
            'feedback_id': feedback.feedback_id,
            'to_user_id': feedback.to_user_id,
            'to_user_name':User.query.filter_by(user_id=feedback.to_user_id).first().username,
            'message': feedback.message,
            'date_sent': feedback.date_sent,
            'confidentiality': feedback.confidentiality
        }
        for feedback in feedbacks
    ]

    return jsonify({'sent_feedback': feedback_data}), 200

@teacher_bp.route('/<int:teacher_id>/classes', methods=['POST'])
@jwt_required()
def create_class(teacher_id):
    if not is_authorized_teacher(teacher_id):
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()
    class_name = data.get('class_name')
    categories_data = data.get('categories')  # List of category names

    new_class = Class(class_name=class_name, teacher_id=teacher_id)
    db.session.add(new_class)
    db.session.commit()

    # Add categories: Check if they already exist, if so, reuse them
    for category_name in categories_data:
        category = Category.query.filter_by(category_name=category_name).first()
        if not category:
            # If the category doesn't exist, create a new one
            category = Category(category_name=category_name, class_id=new_class.class_id)
            db.session.add(category)
        else:
            # If it exists, just reuse the category
            category.class_id = new_class.class_id
        db.session.commit()

    return jsonify({'message': 'Class created successfully', 'class_id': new_class.class_id}), 201


@teacher_bp.route('/<int:teacher_id>/classes/<int:class_id>', methods=['PUT'])
@jwt_required()
def edit_class(teacher_id, class_id):
    if not is_authorized_teacher(teacher_id):
        return jsonify({'message': 'Unauthorized'}), 403

    class_obj = Class.query.filter_by(class_id=class_id, teacher_id=teacher_id).first()
    if not class_obj:
        return jsonify({'message': 'Class not found'}), 404

    data = request.get_json()
    class_name = data.get('class_name')
    categories_data = data.get('categories')  # List of category names

    class_obj.class_name = class_name
    db.session.commit()

    # Update categories
    Category.query.filter_by(class_id=class_id).delete()
    for category_name in categories_data:
        category = Category(category_name=category_name, class_id=class_id)
        db.session.add(category)
    db.session.commit()

    return jsonify({'message': 'Class updated successfully'}), 200

@teacher_bp.route('/<int:teacher_id>/classes/<int:class_id>', methods=['DELETE'])
@jwt_required()
def delete_class(teacher_id, class_id):
    if not is_authorized_teacher(teacher_id):
        return jsonify({'message': 'Unauthorized'}), 403

    class_obj = Class.query.filter_by(class_id=class_id, teacher_id=teacher_id).first()
    if not class_obj:
        return jsonify({'message': 'Class not found'}), 404

    db.session.delete(class_obj)
    db.session.commit()

    return jsonify({'message': 'Class deleted successfully'}), 200
@teacher_bp.route('/<int:teacher_id>/classes/<int:class_id>/tests', methods=['GET'])
@jwt_required()
def get_tests(teacher_id, class_id):
    """
    GET /api/teachers/<teacher_id>/classes/<class_id>/tests
    Retrieves all tests created by the teacher for the specified class, including associated categories.
    """
    if not is_authorized_teacher(teacher_id):
        return jsonify({'message': 'Unauthorized access'}), 403

    # Verify that the class exists and belongs to the teacher
    class_obj = Class.query.filter_by(class_id=class_id, teacher_id=teacher_id).first()
    if not class_obj:
        return jsonify({'message': 'Class not found or does not belong to the teacher'}), 404

    tests = Test.query.filter_by(class_id=class_id).all()
    if not tests:
        return jsonify({'message': 'No tests found for this class'}), 200

    tests_data = []
    for test in tests:
        # Retrieve associated categories
        categories = [
            {
                'category_id': category.category_id,
                'category_name': category.category_name
            }
            for category in test.categories
        ]

        test_info = {
            'test_id': test.test_id,
            'test_name': test.test_name,
            'date_created': test.date_created.isoformat(),
            'deadline': test.deadline.isoformat() if test.deadline else None,
            'categories': categories
        }

        tests_data.append(test_info)

    return jsonify({'tests': tests_data}), 200

@teacher_bp.route('/<int:teacher_id>/classes/<int:class_id>/tests', methods=['POST'])
@jwt_required()
def create_test(teacher_id, class_id):
    if not is_authorized_teacher(teacher_id):
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()
    test_name = data.get('test_name')
    categories_data = data.get('categories')  # List of category IDs
    questions_data = data.get('questions')    # List of questions with options

    # Validate input data
    if not test_name or not isinstance(categories_data, list) or not isinstance(questions_data, list):
        return jsonify({'message': 'Invalid input data'}), 400

    if not categories_data:
        return jsonify({'message': 'Categories list cannot be empty'}), 400

    if not questions_data:
        return jsonify({'message': 'Questions list cannot be empty'}), 400

    # Verify that all category_ids exist and belong to the class
    valid_categories = Category.query.filter(Category.category_id.in_([i['category_id'] for i in categories_data]), Category.class_id == class_id).all()
    if len(valid_categories) != len(categories_data):
        return jsonify({'message': 'One or more categories are invalid or do not belong to the class'}), 400

    new_test = Test(test_name=test_name, class_id=class_id, date_created=datetime.utcnow())

    # Associate categories using the relationship
    new_test.categories = valid_categories

    db.session.add(new_test)
    db.session.commit()

    # Add questions and options
    for q_data in questions_data:
        question_text = q_data.get('question_text')
        category_id = q_data.get('category_id')
        options_data = q_data.get('options')  # List of options with 'option_text' and 'is_correct'

        # Validate question data
        
        if not question_text or not isinstance(category_id, str) or not isinstance(options_data, list):
            print(question_text)
            print(isinstance(category_id, str))
            print(isinstance(options_data, list))
            return jsonify({'message': 'Invalid question data'}), 400

        # Verify that the category_id exists and belongs to the class
        category = Category.query.filter_by(category_id=category_id, class_id=class_id).first()
        if not category:
            return jsonify({'message': f'Category ID {category_id} is invalid or does not belong to the class'}), 400

        question = Question(
            test_id=new_test.test_id,
            category_id=category_id,
            question_text=question_text
        )
        db.session.add(question)
        db.session.commit()

        for opt_data in options_data:
            option_text = opt_data.get('option_text')
            is_correct = opt_data.get('is_correct', False)

            # Validate option data
            if not option_text or not isinstance(is_correct, bool):
                print("Yes")
                return jsonify({'message': 'Invalid option data'}), 400

            option = Option(
                question_id=question.question_id,
                option_text=option_text,
                is_correct=is_correct
            )
            db.session.add(option)
        db.session.commit()

    return jsonify({'message': 'Test created successfully', 'test_id': new_test.test_id}), 201


@teacher_bp.route('/<int:teacher_id>/classes/<int:class_id>/tests/<int:test_id>', methods=['PUT'])
@jwt_required()
def edit_test(teacher_id, class_id, test_id):
    if not is_authorized_teacher(teacher_id):
        return jsonify({'message': 'Unauthorized'}), 403

    test = Test.query.filter_by(test_id=test_id, class_id=class_id).first()
    if not test:
        return jsonify({'message': 'Test not found'}), 404

    data = request.get_json()
    test_name = data.get('test_name')
    categories_data = data.get('categories')  # List of category IDs
    questions_data = data.get('questions')    # List of questions with options

    test.test_name = test_name
    db.session.commit()

    # Update categories
    TestCategories.query.filter_by(test_id=test_id).delete()
    for category_id in categories_data:
        test_category = TestCategories(test_id=test_id, category_id=category_id)
        db.session.add(test_category)
    db.session.commit()

    # Update questions and options
    Question.query.filter_by(test_id=test_id).delete()
    for q_data in questions_data:
        question_text = q_data.get('question_text')
        category_id = q_data.get('category_id')
        options_data = q_data.get('options')

        question = Question(test_id=test_id, category_id=category_id, question_text=question_text)
        db.session.add(question)
        db.session.commit()

        for opt_data in options_data:
            option_text = opt_data.get('option_text')
            is_correct = opt_data.get('is_correct')
            option = Option(question_id=question.question_id, option_text=option_text, is_correct=is_correct)
            db.session.add(option)
        db.session.commit()

    return jsonify({'message': 'Test updated successfully'}), 200

@teacher_bp.route('/<int:teacher_id>/classes/<int:class_id>/tests/<int:test_id>', methods=['DELETE'])
@jwt_required()
def delete_test(teacher_id, class_id, test_id):
    if not is_authorized_teacher(teacher_id):
        return jsonify({'message': 'Unauthorized'}), 403

    test = Test.query.filter_by(test_id=test_id, class_id=class_id).first()
    if not test:
        return jsonify({'message': 'Test not found'}), 404

    db.session.delete(test)
    db.session.commit()

    return jsonify({'message': 'Test deleted successfully'}), 200

@teacher_bp.route('/<int:teacher_id>/classes/<int:class_id>/students/<int:student_id>/performance', methods=['GET'])
@jwt_required()
def view_student_performance(teacher_id, class_id, student_id):
    if not is_authorized_teacher(teacher_id):
        return jsonify({'message': 'Unauthorized'}), 403

    # Verify that the student is enrolled in the class
    class_obj = Class.query.filter_by(class_id=class_id, teacher_id=teacher_id).first()
    if not class_obj:
        return jsonify({'message': 'Class not found'}), 404

    student = Student.query.get(student_id)
    if student not in class_obj.students:
        return jsonify({'message': 'Student not enrolled in this class'}), 403

    # Get performance reports for the student in this class
    performance_reports = PerformanceReport.query.filter_by(student_id=student_id).all()
    reports_data = [
        {
            'report_id': report.report_id,
            'test_id': report.test_id,
            'scores': report.scores,
            'date_taken': report.date_taken
        }
        for report in performance_reports
    ]

    return jsonify({'performance_reports': reports_data}), 200

@teacher_bp.route('/<int:teacher_id>/feedback', methods=['POST'])
@jwt_required()
def provide_feedback(teacher_id):
    if not is_authorized_teacher(teacher_id):
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()
    to_user_id = data.get('to_user_id')
    message = data.get('message')
    confidentiality = data.get('confidentiality')  # 'Student' or 'Parent'

    feedback = Feedback(
        from_user_id=teacher_id,
        to_user_id=to_user_id,
        message=message,
        confidentiality=confidentiality,
        date_sent=datetime.utcnow()
    )
    db.session.add(feedback)
    db.session.commit()

    return jsonify({'message': 'Feedback sent successfully'}), 201
