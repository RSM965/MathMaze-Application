# AutoPop.py

import random
from models import db, Teacher, Class, Category, Test, Question, Option, User, Parent
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
from app import create_app  # Ensure you have an app factory

# Predefined realistic math questions and options
math_questions = {
    'Basic Operations': [
        {
            'question': 'What is 7 + 5?',
            'options': ['10', '12', '14', '15'],
            'correct': 1  # Index of the correct answer
        },
        {
            'question': 'What is 9 - 4?',
            'options': ['3', '4', '5', '6'],
            'correct': 2
        },
        {
            'question': 'What is 6 * 3?',
            'options': ['18', '20', '15', '21'],
            'correct': 0
        },
        {
            'question': 'What is 20 / 5?',
            'options': ['3', '4', '5', '6'],
            'correct': 2
        }
    ],
    'Equations': [
        {
            'question': 'Solve for x: 2x + 3 = 7',
            'options': ['x = 1', 'x = 2', 'x = 3', 'x = 4'],
            'correct': 1
        },
        {
            'question': 'Solve for y: 5y - 10 = 0',
            'options': ['y = 2', 'y = 4', 'y = 0', 'y = -2'],
            'correct': 0
        },
        {
            'question': 'Solve for z: 3z + 9 = 0',
            'options': ['z = 3', 'z = -3', 'z = 0', 'z = 1'],
            'correct': 1
        },
        {
            'question': 'Solve for a: a/2 = 5',
            'options': ['a = 10', 'a = 5', 'a = 15', 'a = 20'],
            'correct': 0
        }
    ],
    'Inequalities': [
        {
            'question': 'Which of the following is true for the inequality 5 > 3?',
            'options': ['True', 'False'],
            'correct': 0
        },
        {
            'question': 'Solve: 2x < 8',
            'options': ['x < 2', 'x < 4', 'x < 6', 'x < 8'],
            'correct': 1
        },
        {
            'question': 'Solve: x + 5 ≥ 10',
            'options': ['x ≥ 5', 'x > 5', 'x ≤ 5', 'x < 5'],
            'correct': 0
        },
        {
            'question': 'Which inequality represents x is at least 3?',
            'options': ['x > 3', 'x ≥ 3', 'x < 3', 'x ≤ 3'],
            'correct': 1
        }
    ],
    'Graphing': [
        {
            'question': 'What is the slope of the line y = 2x + 3?',
            'options': ['1', '2', '3', '4'],
            'correct': 1
        },
        {
            'question': 'Which of the following is the equation of a horizontal line?',
            'options': ['x = 5', 'y = 5', 'x = 0', 'y = 0'],
            'correct': 1
        },
        {
            'question': 'What is the y-intercept of the line y = -x + 4?',
            'options': ['-1', '0', '4', '1'],
            'correct': 2
        },
        {
            'question': 'Which of the following represents a vertical line?',
            'options': ['y = 2x + 1', 'y = -x', 'x = 3', 'y = 0'],
            'correct': 2
        }
    ],
    'Functions': [
        {
            'question': 'What is f(2) for the function f(x) = 2x + 1?',
            'options': ['3', '4', '5', '6'],
            'correct': 2
        },
        {
            'question': 'What is the domain of the function f(x) = 1/x?',
            'options': ['All real numbers', 'x ≠ 0', 'x ≥ 0', 'x ≤ 0'],
            'correct': 1
        },
        {
            'question': 'What is f(3) for the function f(x) = x^2 - 4?',
            'options': ['5', '9', '0', '6'],
            'correct': 0
        },
        {
            'question': 'What is the range of f(x) = -x + 2?',
            'options': ['All real numbers', 'x > 2', 'y < 2', 'y ≥ 2'],
            'correct': 0
        }
    ],
    'Polynomials': [
        {
            'question': 'What is the degree of the polynomial 3x^2 + 2x + 1?',
            'options': ['0', '1', '2', '3'],
            'correct': 2
        },
        {
            'question': 'What is the sum of the polynomials (2x + 3) and (x - 1)?',
            'options': ['3x + 2', 'x + 2', '3x + 4', '2x - 1'],
            'correct': 0
        },
        {
            'question': 'What is the product of (x + 2) and (x - 3)?',
            'options': ['x^2 - x - 6', 'x^2 + x - 6', 'x^2 - x + 6', 'x^2 + 5x + 6'],
            'correct': 0
        },
        {
            'question': 'Simplify: (x^3 + 2x^2) - (x^3 - x)',
            'options': ['2x^2 + x', 'x^2 + x', 'x^2 - x', '3x^2 + x'],
            'correct': 0
        }
    ],
    'Exponents': [
        {
            'question': 'What is 2^3?',
            'options': ['4', '6', '8', '10'],
            'correct': 2
        },
        {
            'question': 'What is the value of x in the equation 2^x = 8?',
            'options': ['x = 2', 'x = 3', 'x = 4', 'x = 5'],
            'correct': 1
        },
        {
            'question': 'Simplify: (3^2)^3',
            'options': ['3^5', '3^6', '3^9', '3^12'],
            'correct': 2
        },
        {
            'question': 'What is 5^0?',
            'options': ['0', '1', '5', 'Undefined'],
            'correct': 1
        }
    ],
    'Logarithms': [
        {
            'question': 'What is log_10(100)?',
            'options': ['1', '2', '3', '4'],
            'correct': 1
        },
        {
            'question': 'Solve for x: log(x) = 3',
            'options': ['x = 3', 'x = 10', 'x = 100', 'x = 1000'],
            'correct': 3
        },
        {
            'question': 'What is log_2(8)?',
            'options': ['2', '3', '4', '5'],
            'correct': 1
        },
        {
            'question': 'If log_b(a) = c, then a = ___',
            'options': ['b^c', 'c^b', 'b/c', 'c/b'],
            'correct': 0
        }
    ],
    'Derivatives': [
        {
            'question': 'What is the derivative of f(x) = 3x^2?',
            'options': ['3x', '6x', '9x', 'x^2'],
            'correct': 1
        },
        {
            'question': 'What is the derivative of f(x) = x^3?',
            'options': ['x^2', '3x^2', '2x', '3x'],
            'correct': 1
        },
        {
            'question': 'What is the derivative of f(x) = sin(x)?',
            'options': ['cos(x)', '-cos(x)', '-sin(x)', 'sin(x)'],
            'correct': 0
        },
        {
            'question': 'What is the derivative of f(x) = e^x?',
            'options': ['e^x', 'x * e^(x-1)', 'e^(x-1)', 'x * e^x'],
            'correct': 0
        }
    ],
    'Integrals': [
        {
            'question': 'What is the integral of f(x) = 2x?',
            'options': ['x^2 + C', '2x + C', 'x + C', 'x^2 - C'],
            'correct': 0
        },
        {
            'question': 'What is the integral of f(x) = 1?',
            'options': ['x + C', '2x + C', '1 + C', '0 + C'],
            'correct': 0
        },
        {
            'question': 'What is the integral of f(x) = e^x?',
            'options': ['e^x + C', 'x * e^x + C', 'e^(x-1) + C', 'x + C'],
            'correct': 0
        },
        {
            'question': 'What is the integral of f(x) = cos(x)?',
            'options': ['sin(x) + C', '-sin(x) + C', 'cos(x) + C', '-cos(x) + C'],
            'correct': 0
        }
    ]
}

def populate_db_with_teachers_classes_categories():
    """
    Populates the database with 2 teachers, 20 classes, and 20 unique categories.
    Each class is assigned 5 categories randomly selected from the 20 available.
    """
    # Create two teachers
    teacher1 = User(
        username='teacher1',
        email='teacher1@math.com',
        password_hash=generate_password_hash('password1'),
        role='Teacher'
    )
    teacher2 = User(
        username='teacher2',
        email='teacher2@math.com',
        password_hash=generate_password_hash('password2'),
        role='Teacher'
    )
    db.session.add(teacher1)
    db.session.add(teacher2)
    db.session.commit()

    # Create Teacher entries linked to User
    t1 = Teacher(teacher_id=teacher1.user_id)
    t2 = Teacher(teacher_id=teacher2.user_id)
    db.session.add(t1)
    db.session.add(t2)
    db.session.commit()

    # Define 20 unique category names
    all_category_names = list(math_questions.keys())
    if len(all_category_names) < 20:
        # If less than 20, replicate some categories or extend the list
        additional_categories = [f"Category {i}" for i in range(len(all_category_names) + 1, 21)]
        all_category_names.extend(additional_categories[:20 - len(all_category_names)])

    # Ensure we have exactly 20 category names
    all_category_names = all_category_names[:20]

    # Create 20 classes and assign them to teachers
    class_names = [f'Class {i + 1}' for i in range(20)]
    teacher_assignment = [t1, t2] * 10  # Alternate between teachers

    for i, class_name in enumerate(class_names):
        new_class = Class(
            class_name=class_name,
            teacher_id=teacher_assignment[i].teacher_id
        )
        db.session.add(new_class)
        db.session.commit()

        # Assign 5 random categories to each class
        assigned_category_names = random.sample(all_category_names, 5)
        for category_name in assigned_category_names:
            # Create a new Category per class with class_id
            class_category = Category(
                category_name=category_name,
                class_id=new_class.class_id
            )
            db.session.add(class_category)
        db.session.commit()

    print("Database populated with 2 teachers, 20 classes, and categories assigned per class.")

def populate_db_with_tests_and_questions():
    """
    Populates the database with 2 tests per class.
    Each test contains at least 5 questions, randomly selected from the class's assigned categories.
    """
    classes = Class.query.all()

    for new_class in classes:
        # Fetch the assigned categories for the class
        assigned_categories = Category.query.filter_by(class_id=new_class.class_id).all()
        if len(assigned_categories) < 5:
            print(f"Class {new_class.class_name} has fewer than 5 categories. Skipping.")
            continue

        for test_num in range(1, 3):  # Create 2 tests per class
            test_name = f'{new_class.class_name} Test {test_num}'
            test_deadline = datetime.utcnow() + timedelta(days=7)  # Set deadline 7 days from creation

            test = Test(
                test_name=test_name,
                class_id=new_class.class_id,
                date_created=datetime.utcnow(),
                deadline=test_deadline
            )
            db.session.add(test)
            db.session.commit()

            # Associate the test with the assigned categories
            test.categories.extend(assigned_categories)
            db.session.commit()

            # Select 5 random questions from the assigned categories
            questions_pool = []
            for category in assigned_categories:
                category_questions = math_questions.get(category.category_name, [])
                # Tag questions with their category name
                for q in category_questions:
                    q['category_name'] = category.category_name
                questions_pool.extend(category_questions)

            if len(questions_pool) < 5:
                print(f"Not enough questions in categories for {new_class.class_name}. Skipping test creation.")
                continue

            selected_questions = random.sample(questions_pool, 5)

            for q_data in selected_questions:
                question_text = q_data['question']
                options_data = q_data['options']
                correct_index = q_data['correct']
                category_name = q_data.get('category_name', '')

                # Find the category object matching the question's category
                category = next((cat for cat in assigned_categories if cat.category_name == category_name), None)
                if not category:
                    category = assigned_categories[0]  # Default to the first assigned category

                question = Question(
                    test_id=test.test_id,
                    category_id=category.category_id,
                    question_text=question_text
                )
                db.session.add(question)
                db.session.commit()

                # Shuffle options to randomize their order
                options_shuffled = list(enumerate(options_data))
                random.shuffle(options_shuffled)

                for original_idx, option_text in options_shuffled:
                    is_correct = (original_idx == correct_index)
                    option = Option(
                        question_id=question.question_id,
                        option_text=option_text,
                        is_correct=is_correct
                    )
                    db.session.add(option)
                db.session.commit()

    print("Database populated with tests and questions.")


def populate_db_with_students_and_parents():
    """
    Populates the database with students and parents for a more comprehensive dataset.
    """
    # Create some parents
    parents = []
    for i in range(10):
        parent_user = User(
            username=f'parent{i+1}',
            email=f'parent{i+1}@math.com',
            password_hash=generate_password_hash('password'),
            role='Parent'
        )
        db.session.add(parent_user)
        db.session.commit()

        parent = Parent(
            parent_id=parent_user.user_id,
            children_id=None  # To be linked later
        )
        db.session.add(parent)
        parents.append(parent)
    db.session.commit()

    # Create some students
    for i in range(30):
        parent = random.choice(parents)
        student_user = User(
            username=f'student{i+1}',
            email=f'student{i+1}@math.com',
            password_hash=generate_password_hash('password'),
            role='Student'
        )
        db.session.add(student_user)
        db.session.commit()

        student = Student(
            student_id=student_user.user_id,
            parent_id=parent.parent_id,
            parent_email=parent_user.email
        )
        db.session.add(student)
        db.session.commit()

        # Assign student to random classes
        enrolled_classes = random.sample(Class.query.all(), 3)  # Enroll in 3 random classes
        for enrolled_class in enrolled_classes:
            student.enrolled_classes.append(enrolled_class)
        db.session.commit()

        # Assign random interest categories
        all_categories = Category.query.all()
        interest_categories = random.sample(all_categories, 3)  # Each student interested in 3 categories
        for category in interest_categories:
            student.interest_categories.append(category)
        db.session.commit()

    print("Database populated with students and parents.")

if __name__ == "__main__":
    app = create_app()  # Ensure you're using an app factory
    with app.app_context():
        # Optionally, reset the database
        # db.drop_all()
        # db.create_all()

        populate_db_with_teachers_classes_categories()
        populate_db_with_tests_and_questions()
        # populate_db_with_students_and_parents()