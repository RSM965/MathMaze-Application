# train_recommendation_model.py

import os
import pickle
from models import Student, PerformanceReport, Test, Class, Category, db
import numpy as np
from collections import defaultdict
from app import create_app

MODEL_PATH = "recommender_model.pkl"

# In-memory recommendation model (initially empty, will be loaded from file if available)
recommendation_model = {}

# Define the boosting factor for interests
BOOST_FACTOR = 0.15  # 15% boost for interest-matching classes

def train_model():
    """
    Train a recommendation model using student performance data and their category interests.
    The model will be based on performance reports and students' interests in categories.
    """
    # Clear the model before training
    recommendation_model.clear()

    # Collect all students and their data
    students = Student.query.all()
    if not students:
        print("No students found in the database.")
        return

    class_scores = defaultdict(list)
    class_interest_counts = defaultdict(int)

    total_students = len(students)
    print(f"Total number of students: {total_students}")

    # Collect performance data and interests from students
    for student in students:
        print(f"Processing student: {student.student_id}")

        # Process performance reports
        for report in student.performance_reports:
            # Get the associated test and class using the test_id
            test = Test.query.filter_by(test_id=report.test_id).first()
            if not test:
                continue  # Skip if test doesn't exist

            class_id = test.class_id

            # Aggregate scores for the class
            # Assuming report.scores is a dictionary of category_id to score
            # We'll use the average score for this report
            if report.scores:
                average_score = np.mean(list(report.scores.values()))
                class_scores[class_id].append(average_score)
                print(f"Added average score {average_score} for class {class_id}")
            else:
                print(f"No scores found in report {report.report_id} for student {student.student_id}")

        # Collect interests
        for interest_category in student.interest_categories:
            category_id = interest_category.category_id
            print(f"Student {student.student_id} has interest in category {category_id}")
            # Find classes that include this category
            matching_classes = Class.query.join(Class.categories).filter(Category.category_id == category_id).all()

            for cls in matching_classes:
                class_interest_counts[cls.class_id] += 1
                print(f"Incremented interest count for class {cls.class_id}")

    # Calculate average scores per class
    class_average_scores = {}
    for class_id, scores in class_scores.items():
        class_average_scores[class_id] = np.mean(scores)
        print(f"Class {class_id} average score: {class_average_scores[class_id]}")

    # Calculate final boosted scores and save to the recommendation model
    for class_id, average_score in class_average_scores.items():
        interest_count = class_interest_counts.get(class_id, 0)
        boost_multiplier = 1 + BOOST_FACTOR * (interest_count / total_students)
        boosted_score = average_score * boost_multiplier
        recommendation_model[class_id] = boosted_score
        print(f"Class {class_id} boosted score: {boosted_score}")

    # Save the trained model to a pickle file
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(recommendation_model, f)

    print(f"Recommendation model trained and saved to {MODEL_PATH}.")

def load_model():
    """Load the recommendation model from a file if it exists."""
    global recommendation_model
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, 'rb') as f:
            recommendation_model = pickle.load(f)
        print(f"Recommendation model loaded from {MODEL_PATH}.")
        return recommendation_model
    else:
        print(f"No saved model found. Starting with an empty model.")
        return {}

if __name__ == "__main__":
    app = create_app()  # Assuming you're using an app factory
    with app.app_context():
        train_model()
