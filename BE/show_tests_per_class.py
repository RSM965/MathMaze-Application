# show_classes_tests_categories.py

from models import db, Class, Test, Category
from app import create_app  # Ensure you have an app factory

def show_classes_tests_and_categories():
    classes = Class.query.all()
    for cls in classes:
        print(f"Class: {cls.class_name}")
        tests = Test.query.filter_by(class_id=cls.class_id).all()
        for test in tests:
            print(f"  Test: {test.test_name}")
            # Get categories associated with the test
            categories = test.categories
            for category in categories:
                print(f"    Category: {category.category_name}")
    print("Done listing classes, tests, and categories.")

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        show_classes_tests_and_categories()
