from models import db, Student, Class, Test, Option, PerformanceReport, User, Category
from random import choice, randint
from datetime import datetime
from faker import Faker
from app import create_app
import numpy as np

fake = Faker()

def add_students_to_classes(num_students=20):
    """Adds students to multiple classes, randomizes interests, and automates test-taking for each student."""
    students = []
    
    # Fetch all categories and classes to assign to students
    categories = Category.query.all()
    classes = Class.query.all()
    
    for i in range(num_students):
        # Create a new user and corresponding student
        user = User(username=fake.unique.user_name(), email=fake.unique.email(), password_hash=fake.password(), role='Student')
        db.session.add(user)
        db.session.commit()
        
        student = Student(student_id=user.user_id, parent_email=fake.email())
        db.session.add(student)
        db.session.commit()

        # Randomly assign categories (interests) to the student
        random_categories = randomize_interests(categories)
        student.interest_categories = random_categories  # This adds the student to the categories
        db.session.commit()

        students.append(student)

        # Enroll the student in random classes
        enrolled_class = choice(classes)
        enrolled_class.students.append(student)
        db.session.commit()

    # Simulate test results
    generate_test_results(students, classes)

    # Generate recommendations for the top 5 enrolled classes
    generate_recommendations()

def randomize_interests(categories):
    """Randomly assign 2-4 categories to a student."""
    num_interests = randint(2, 4)  # Assign between 2 and 4 interests to each student
    return [choice(categories) for _ in range(num_interests)]

def generate_test_results(students, classes):
    """Automates test-taking by generating random results for each student."""
    data_points = 0
    for student in students:
        for cls in student.enrolled_classes:
            tests = Test.query.filter_by(class_id=cls.class_id).all()
            for test in tests:
                if PerformanceReport.query.filter_by(student_id=student.student_id, test_id=test.test_id).first():
                    continue

                scores = {}
                total_questions = len(test.questions)
                for question in test.questions:
                    selected_option = choice(question.options)
                    if selected_option.is_correct:
                        if question.category_id not in scores:
                            scores[question.category_id] = 0
                        scores[question.category_id] += 1

                report = PerformanceReport(
                    student_id=student.student_id,
                    test_id=test.test_id,
                    scores={k: (v / total_questions) * 100 for k, v in scores.items()},
                    date_taken=datetime.utcnow()
                )
                db.session.add(report)
                db.session.commit()
                data_points += 1

                if data_points >= 200:
                    print("200 data points created.")
                    return

def generate_recommendations():
    """Recommend the top 5 classes based on enrollments."""
    classes = Class.query.all()

    # Count the number of students enrolled in each class
    class_enrollment_counts = {
        cls.class_id: len(cls.students) for cls in classes
    }

    # Sort the classes by enrollment count in descending order
    top_5_classes = sorted(class_enrollment_counts.items(), key=lambda x: x[1], reverse=True)[:5]

    print("\nTop 5 Enrolled Classes (by number of students):")
    for class_id, count in top_5_classes:
        class_obj = Class.query.get(class_id)
        if class_obj:
            print(f"Class: {class_obj.class_name}, Enrollments: {count}")
        else:
            print(f"Class ID {class_id} not found, Enrollments: {count}")

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        add_students_to_classes(20)
        print("Data generation complete.")
