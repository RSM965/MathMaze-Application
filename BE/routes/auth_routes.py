from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import User, Teacher, Student, Parent,Category
from extensions import db
from flask_jwt_extended import create_access_token
from datetime import datetime

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    pemail = data.get('pemail')
    category_ids = data.get('categories', [])

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already registered'}), 409

    password_hash = generate_password_hash(password)
    user = User(username=username, email=email, password_hash=password_hash, role=role)
    db.session.add(user)
    db.session.commit()

    if role == 'Student':
        # Create student and assign parent email
        student = Student(student_id=user.user_id, parent_email=pemail)

        # Assign interest categories to the student
        categories = Category.query.filter(Category.category_id.in_(category_ids)).all()
        if not categories:
            return jsonify({'message': 'Invalid category IDs'}), 400
        student.interest_categories.extend(categories)

        db.session.add(student)

    elif role == 'Teacher':
        teacher = Teacher(teacher_id=user.user_id)
        db.session.add(teacher)
        
    elif role == 'Parent' and Student.query.filter_by(parent_email=email).first():
        parent = Parent(parent_id=user.user_id, children_id=Student.query.filter_by(parent_email=email).first().student_id)
        db.session.add(parent)

    else:
        return jsonify({'message': 'Invalid role'}), 400

    db.session.commit()

    return jsonify({'message': 'User registered successfully', 'user_id': user.user_id}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Invalid credentials'}), 401

    user.last_login = datetime.utcnow()
    db.session.commit()

    token = create_access_token(identity={'user_id': user.user_id, 'role': user.role})

    return jsonify({'token': token, 'user_id': user.user_id, 'role': user.role}), 200
