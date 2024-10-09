from flask import Blueprint, jsonify, request
from models import Class, Category, db
from chatbot import get_response
misc_bp = Blueprint('misc_bp', __name__, url_prefix='/api')

@misc_bp.route('/classes/<int:class_id>/categories', methods=['GET'])
def get_class_categories(class_id):
    categories = Category.query.filter_by(class_id=class_id).all()
    categories_data = [{'category_id': category.category_id, 'category_name': category.category_name} for category in categories]
    return jsonify({'categories': categories_data}), 200

@misc_bp.route('/classes/categories', methods=['GET'])
def get_all_categories():
    # Query all categories from the Category table
    categories = Category.query.all()

    # Prepare the data to return as JSON
    categories_data = [{'category_id': category.category_id, 'category_name': category.category_name} for category in categories]

    # Return the categories in JSON format with a 200 OK status
    return jsonify({'categories': categories_data}), 200

@misc_bp.route('/classes', methods=['GET'])
def get_available_classes():
    classes = Class.query.all()
    classes_data = [{'class_id': c.class_id, 'class_name': c.class_name, 'teacher_id': c.teacher_id} for c in classes]
    return jsonify({'classes': classes_data}), 200

@misc_bp.route('/chatbot',methods=['POST'])
def getChatResponse():
    data = request.get_json()
    print(data)
    resp=get_response(data["message"],data["history"])
    print(resp)
    return jsonify({'reply': resp}),200
