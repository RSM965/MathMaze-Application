from flask import Blueprint, request, jsonify
from models import Student, Class, Test, Question, Option, PerformanceReport, Feedback, db ,User
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

student_bp = Blueprint('student_bp', __name__, url_prefix='/api/students')

def is_authorized_student(student_id):
    identity = get_jwt_identity()
    return identity['user_id'] == student_id and identity['role'] == 'Student'

@student_bp.route('/<int:student_id>/tests/<int:test_id>', methods=['GET'])
@jwt_required()
def get_test_details(student_id, test_id):
    """
    GET /api/students/<student_id>/tests/<test_id>
    Retrieves detailed information about a specific test, including questions and options.
    """
    if True:
        #logger.info(f"Fetching Test ID {test_id} for Student ID {student_id}")

        # Authorization Check
        if not is_authorized_student(student_id):
            #logger.warning(f"Unauthorized access attempt by user {get_jwt_identity()['user_id']}")
            return jsonify({'message': 'Unauthorized access'}), 403

        # Fetch Student from Database
        student = Student.query.filter_by(student_id=student_id).first()
        if not student:
            #logger.warning(f"Student ID {student_id} not found")
            return jsonify({'message': 'Student not found'}), 404

        # Fetch Test from Database
        test = Test.query.filter_by(test_id=test_id).first()
        if not test:
            #logger.warning(f"Test ID {test_id} not found")
            return jsonify({'message': 'Test not found'}), 404
        print(test)
        # Check if the student is enrolled in the class associated with the test
        # if test.class_ not in student.enrolled_classes:
        #     #logger.warning(f"Student ID {student_id} is not enrolled in Class ID {test.class_.class_id}")
        #     return jsonify({'message': 'Student is not enrolled in the class associated with this test'}), 400

        # Fetch Questions and Options
        questions = Question.query.filter_by(test_id=test_id).all()
        if not questions:
            #logger.info(f"No questions found for Test ID {test_id}")
            return jsonify({'message': 'No questions found for this test'}), 200

        # Serialize Test Details
        test_details = {
            'test_id': test.test_id,
            'test_name': test.test_name,
            'date_created': test.date_created.isoformat(),
            'deadline': test.deadline.isoformat() if test.deadline else None,
            'categories': [
                {
                    'category_id': category.category_id,
                    'category_name': category.category_name
                }
                for category in test.categories
            ],
            'questions': []
        }

        for question in questions:
            options = [
                {
                    'option_id': option.option_id,
                    'option_text': option.option_text
                    # 'is_correct': option.is_correct  # Exclude if you don't want to reveal correct answers
                }
                for option in question.options
            ]

            question_info = {
                'question_id': question.question_id,
                'question_text': question.question_text,
                'category_id': question.category_id,
                'options': options
            }

            test_details['questions'].append(question_info)

        #logger.info(f"Fetched Test ID {test_id} details for Student ID {student_id}")
        return jsonify({'test': test_details}), 200

    # except Exception as e:
    #     #logger.error(f"Error fetching Test ID {test_id} for Student ID {student_id}: {e}")
    #     return jsonify({'message': 'An unexpected error occurred'}), 500

@student_bp.route('/<int:student_id>/classes/<int:class_id>/tests', methods=['GET'])
@jwt_required()
def get_student_class_tests(student_id, class_id):
    """
    GET /api/students/<student_id>/classes/<class_id>/tests
    Retrieves all tests available to the student for the specified class, including associated categories.
    """
    try:
        ##logger.info(f"Fetching tests for Student ID {student_id} in Class ID {class_id}")

        # Authorization Check
        if not is_authorized_student(student_id):
            ##logger.warning(f"Unauthorized access attempt by user {get_jwt_identity()['user_id']}")
            return jsonify({'message': 'Unauthorized access'}), 403

        # Fetch Student and Class from Database
        student = Student.query.filter_by(student_id=student_id).first()
        if not student:
            ##logger.warning(f"Student ID {student_id} not found")
            return jsonify({'message': 'Student not found'}), 404

        class_obj = Class.query.filter_by(class_id=class_id).first()
        if not class_obj:
            ##logger.warning(f"Class ID {class_id} not found")
            return jsonify({'message': 'Class not found'}), 404

        # Check if the student is enrolled in the class
        if class_obj not in student.enrolled_classes:
            ##logger.warning(f"Student ID {student_id} is not enrolled in Class ID {class_id}")
            return jsonify({'message': 'Student is not enrolled in this class'}), 400

        # Fetch Tests associated with the class
        tests = Test.query.filter_by(class_id=class_id).all()
        if not tests:
            ##logger.info(f"No tests found for Class ID {class_id}")
            return jsonify({'message': 'No tests found for this class'}), 200

        # Serialize Tests Data
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

        ##logger.info(f"Fetched {len(tests_data)} tests for Student ID {student_id} in Class ID {class_id}")
        return jsonify({'tests': tests_data}), 200

    except Exception as e:
        ##logger.error(f"Error fetching tests for Student ID {student_id} in Class ID {class_id}: {e}")
        return jsonify({'message': 'An unexpected error occurred'}), 500
@student_bp.route('/<int:student_id>/classes/<int:class_id>/enroll', methods=['POST'])
@jwt_required()
def enroll_in_class(student_id, class_id):
    if not is_authorized_student(student_id):
        return jsonify({'message': 'Unauthorized'}), 403

    class_obj = Class.query.get(class_id)
    if not class_obj:
        return jsonify({'message': 'Class not found'}), 404

    student = Student.query.get(student_id)
    if student in class_obj.students:
        return jsonify({'message': 'Already enrolled in this class'}), 400

    class_obj.students.append(student)
    db.session.commit()

    return jsonify({'message': 'Enrolled in class successfully'}), 200

@student_bp.route('/<int:student_id>/tests/<int:test_id>/submit', methods=['POST'])
@jwt_required()
def take_test(student_id, test_id):
    if not is_authorized_student(student_id):
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()
    answers = data.get('answers')  # {question_id: selected_option_id}

    test = Test.query.get(test_id)
    if not test:
        return jsonify({'message': 'Test not found'}), 404

    # Check if student has already taken the test
    existing_report = PerformanceReport.query.filter_by(student_id=student_id, test_id=test_id).first()
    if existing_report:
        return jsonify({'message': 'Test can only be taken once'}), 400

    # Verify that the student is enrolled in the class
    class_obj = Class.query.filter_by(class_id=test.class_id).first()
    student = Student.query.get(student_id)
    if student not in class_obj.students:
        return jsonify({'message': 'Not enrolled in the class associated with this test'}), 403

    # Calculate scores and percentages
    scores = {}
    category_questions = {}  # Keep track of the total number of questions per category
    correct_answers = 0
    total_questions = 0

    for question in test.questions:
        total_questions += 1
        question_id_str = str(question.question_id)
        category_id_str = str(question.category_id)

        # Ensure that we track the number of questions for each category
        if category_id_str not in category_questions:
            category_questions[category_id_str] = 0
            scores[category_id_str] = 0  # Initialize the score for the category

        category_questions[category_id_str] += 1

        # Check if the selected option is correct
        selected_option_id = answers.get(question_id_str)
        selected_option = Option.query.get(selected_option_id)

        if selected_option and selected_option.is_correct:
            scores[category_id_str] += 1  # Increment the score if the answer is correct

    # Calculate percentages for each category
    percentages = {}
    for category_id_str, correct_count in scores.items():
        total_category_questions = category_questions[category_id_str]
        percentages[category_id_str] = (correct_count / total_category_questions) * 100

    # Save PerformanceReport with percentages
    performance_report = PerformanceReport(
        student_id=student_id,
        test_id=test_id,
        scores=percentages,  # Now storing percentages in scores
        date_taken=datetime.utcnow()
    )
    db.session.add(performance_report)
    db.session.commit()

    # Prepare response data
    response_data = {
        'total_questions': total_questions,
        'correct_answers': correct_answers,
        'scores': percentages  # Returning percentages instead of raw scores
    }

    return jsonify({'message': 'Test submitted successfully', 'performance_report': response_data}), 200


@student_bp.route('/<int:student_id>/classes', methods=['GET'])
@jwt_required()
def get_student_classes(student_id):
    """
    GET /api/students/<student_id>/classes
    Retrieves all classes the student with student_id is enrolled in.
    """
    try:
        # ##logger.info(f"Fetching classes for student ID {student_id}")

        # Authorization Check
        if not is_authorized_student(student_id):
            # ##logger.warning(f"Unauthorized access attempt by user {get_jwt_identity()['user_id']}")
            return jsonify({'message': 'Unauthorized access'}), 403

        # Fetch Student from Database
        student = Student.query.filter_by(student_id=student_id).first()
        if not student:
            # ##logger.warning(f"Student ID {student_id} not found")
            return jsonify({'message': 'Student not found'}), 404

        # Fetch Enrolled Classes
        enrolled_classes = student.enrolled_classes
        if not enrolled_classes:
            # ##logger.info(f"Student ID {student_id} is not enrolled in any classes")
            return jsonify({'message': 'No classes found for this student'}), 200

        # Serialize Classes Data
        classes_data = []
        for cls in enrolled_classes:
            class_info = {
                'class_id': cls.class_id,
                'class_name': cls.class_name,
                'teacher_id': cls.teacher_id,
                'categories': [
                    {
                        'category_id': category.category_id,
                        'category_name': category.category_name
                    }
                    for category in cls.categories
                ]
            }
            classes_data.append(class_info)

        # ##logger.info(f"Fetched {len(classes_data)} classes for student ID {student_id}")
        return jsonify({'classes': classes_data}), 200

    except Exception as e:
        # ##logger.error(f"Error fetching classes for student ID {student_id}: {e}")
        return jsonify({'message': 'An unexpected error occurred'}), 500

def getScores(scores):
    print(scores)
    return scores

@student_bp.route('/<int:student_id>/performance', methods=['GET'])
@jwt_required()
def view_performance_reports(student_id):
    if not is_authorized_student(student_id):
        return jsonify({'message': 'Unauthorized'}), 403

    performance_reports = PerformanceReport.query.filter_by(student_id=student_id).all()
    reports_data = [
        {
            'report_id': report.report_id,
            'test_id': report.test_id,
            'scores': getScores(report.scores),  # No change needed with PickleType
            'date_taken': report.date_taken
        }
        for report in performance_reports
    ]

    return jsonify({'performance_reports': reports_data}), 200

@student_bp.route('/<int:student_id>/feedback', methods=['GET'])
@jwt_required()
def view_feedback(student_id):
    if not is_authorized_student(student_id):
        return jsonify({'message': 'Unauthorized'}), 403

    feedbacks = Feedback.query.filter_by(to_user_id=student_id, confidentiality='Student').all()
    feedback_data = [
        {
            'feedback_id': feedback.feedback_id,
            'from_user_id': feedback.from_user_id,
            'from_user_name':User.query.filter_by(user_id=feedback.from_user_id).first().username,
            'message': feedback.message,
            'date_sent': feedback.date_sent
        }
        for feedback in feedbacks
    ]

    return jsonify({'feedback_messages': feedback_data}), 200

@student_bp.route('/<int:student_id>/feedback', methods=['POST'])
@jwt_required()
def respond_to_feedback(student_id):
    if not is_authorized_student(student_id):
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()
    to_user_id = data.get('to_user_id')
    message = data.get('message')

    feedback = Feedback(
        from_user_id=student_id,
        to_user_id=to_user_id,
        
        message=message,
        confidentiality='Student',
        date_sent=datetime.utcnow()
    )
    db.session.add(feedback)
    db.session.commit()

    return jsonify({'message': 'Feedback sent successfully'}), 201
