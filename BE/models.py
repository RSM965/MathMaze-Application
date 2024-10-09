from datetime import datetime
from sqlalchemy.types import PickleType
from extensions import db  # Ensure db is imported from extensions.py

# Association Table for Many-to-Many Relationship between Test and Category
test_categories = db.Table('test_categories',
    db.Column('test_id', db.Integer, db.ForeignKey('tests.test_id'), primary_key=True),
    db.Column('category_id', db.Integer, db.ForeignKey('categories.category_id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(10), nullable=False)  # 'Teacher', 'Student', 'Parent'
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)

    teacher = db.relationship('Teacher', backref='user', uselist=False)
    student = db.relationship('Student', backref='user', uselist=False)
    parent = db.relationship('Parent', backref='user', uselist=False)

# Association table for Many-to-Many relationship between Class and Student
class_students = db.Table('class_students',
    db.Column('class_id', db.Integer, db.ForeignKey('classes.class_id'), primary_key=True),
    db.Column('student_id', db.Integer, db.ForeignKey('students.student_id'), primary_key=True)
)

# Teacher Model
class Teacher(db.Model):
    __tablename__ = 'teachers'

    teacher_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), primary_key=True)
    classes = db.relationship('Class', backref='teacher', lazy=True)

# Student Model
class Student(db.Model):
    __tablename__ = 'students'

    student_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('parents.parent_id'))
    parent_email=db.Column(db.String(120), nullable=False)
    enrolled_classes = db.relationship('Class', secondary=class_students, back_populates='students')
    performance_reports = db.relationship('PerformanceReport', backref='student', lazy=True)

# Parent Model
class Parent(db.Model):
    __tablename__ = 'parents'

    parent_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), primary_key=True)
    children_id = db.Column(db.Integer,nullable=False)
    children = db.relationship('Student', backref='parent', lazy=True)

# Class Model
class Class(db.Model):
    __tablename__ = 'classes'

    class_id = db.Column(db.Integer, primary_key=True)
    class_name = db.Column(db.String(100), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.teacher_id'), nullable=False)
    categories = db.relationship('Category', backref='class', lazy=True)
    students = db.relationship('Student', secondary=class_students, back_populates='enrolled_classes')
    tests = db.relationship('Test', backref='class', lazy=True)

# Category Model
class Category(db.Model):
    __tablename__ = 'categories'

    category_id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String(50), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.class_id'), nullable=False)

# Test Model
class Test(db.Model):
    __tablename__ = 'tests'

    test_id = db.Column(db.Integer, primary_key=True)
    test_name = db.Column(db.String(100), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.class_id'), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    deadline = db.Column(db.DateTime)
    questions = db.relationship('Question', backref='test', lazy=True)
    categories = db.relationship('Category', secondary=test_categories, backref=db.backref('tests', lazy=True))

# Question Model
class Question(db.Model):
    __tablename__ = 'questions'

    question_id = db.Column(db.Integer, primary_key=True)
    test_id = db.Column(db.Integer, db.ForeignKey('tests.test_id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.category_id'), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    options = db.relationship('Option', backref='question', lazy=True)

# Option Model
class Option(db.Model):
    __tablename__ = 'options'

    option_id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.question_id'), nullable=False)
    option_text = db.Column(db.String(255), nullable=False)
    is_correct = db.Column(db.Boolean, default=False)

# PerformanceReport Model
class PerformanceReport(db.Model):
    __tablename__ = 'performance_reports'

    report_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.student_id'), nullable=False)
    test_id = db.Column(db.Integer, db.ForeignKey('tests.test_id'), nullable=False)
    scores = db.Column(PickleType)  # Use PickleType for SQLite compatibility
    date_taken = db.Column(db.DateTime, default=datetime.utcnow)

# Feedback Model
class Feedback(db.Model):
    __tablename__ = 'feedbacks'

    feedback_id = db.Column(db.Integer, primary_key=True)
    from_user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    to_user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    date_sent = db.Column(db.DateTime, default=datetime.utcnow)
    confidentiality = db.Column(db.String(10))  # 'Student', 'Parent'

    from_user = db.relationship('User', foreign_keys=[from_user_id])
    to_user = db.relationship('User', foreign_keys=[to_user_id])
