import pickle
from models import Student, Class, db
import os
from app import create_app
MODEL_PATH = "recommender_model.pkl"

def load_model():
    """Load the trained recommendation model from the pickle file."""
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, 'rb') as f:
            return pickle.load(f)
    else:
        print(f"Model file {MODEL_PATH} not found.")
        return {}

def test_recommendations():
    """Test the recommendations by displaying the top 5 recommended classes for each student."""
    recommendation_model = load_model()

    # Fetch all students from the database
    students = Student.query.all()

    if not students:
        print("No students found in the database.")
        return

    if not recommendation_model:
        print("No recommendations available.")
        return

    for student in students:
        print(f"\nRecommendations for {student.user.username} (Student ID: {student.student_id}):")

        # Get the student's enrolled classes
        enrolled_classes = [cls.class_id for cls in student.enrolled_classes]

        # Filter out classes that the student is already enrolled in
        recommendations = {cls_id: score for cls_id, score in recommendation_model.items() if cls_id not in enrolled_classes}

        # Sort the recommendations by score in descending order
        sorted_recommendations = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)

        if sorted_recommendations:
            print("Top 5 Recommended Classes:")
            for cls_id, score in sorted_recommendations[:5]:
                cls = Class.query.filter_by(class_id=cls_id).first()
                print(f"Class ID: {cls.class_id}, Class Name: {cls.class_name}, Score: {score}")
        else:
            print("No recommendations available.")

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        test_recommendations()
