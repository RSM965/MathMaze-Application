import uuid
from app import db, login
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

# User Roles
ROLE_STUDENT = 'student'
ROLE_PARENT = 'parent'
ROLE_TEACHER = 'teacher'

class User(UserMixin, db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    
    # Relationships
    student = db.relationship('Student', backref='user', uselist=False)
    parent = db.relationship('Parent', backref='user', uselist=False)
    teacher = db.relationship('Teacher', backref='user', uselist=False)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.username}>'

@login.user_loader
def load_user(id):
    return User.query.get(id)

class Parent(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    
    # Relationships
    students = db.relationship('Student', backref='parent', lazy=True)
    
    def __repr__(self):
        return f'<Parent {self.id}>'

class Student(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(80), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    parent_id = db.Column(db.String(36), db.ForeignKey('parent.id'), nullable=False)
    
    # Relationships
    test_results = db.relationship('TestResult', backref='student', lazy=True)
    
    def __repr__(self):
        return f'<Student {self.name}>'

class Teacher(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    
    # Relationships
    tests = db.relationship('Test', backref='teacher', lazy=True)
    
    def __repr__(self):
        return f'<Teacher {self.id}>'

class Test(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    teacher_id = db.Column(db.String(36), db.ForeignKey('teacher.id'), nullable=False)
    date_created = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    
    # Relationships
    questions = db.relationship('Question', backref='test', lazy=True)
    results = db.relationship('TestResult', backref='test', lazy=True)
    
    def __repr__(self):
        return f'<Test {self.name}>'

class Question(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    text = db.Column(db.Text, nullable=False)
    test_id = db.Column(db.String(36), db.ForeignKey('test.id'), nullable=False)
    
    # Relationships
    options = db.relationship('Option', backref='question', lazy=True)
    
    def __repr__(self):
        return f'<Question {self.text[:50]}>'

class Option(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    text = db.Column(db.String(255), nullable=False)
    is_correct = db.Column(db.Boolean, default=False, nullable=False)
    question_id = db.Column(db.String(36), db.ForeignKey('question.id'), nullable=False)
    
    def __repr__(self):
        return f'<Option {self.text}>'

class TestResult(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = db.Column(db.String(36), db.ForeignKey('student.id'), nullable=False)
    test_id = db.Column(db.String(36), db.ForeignKey('test.id'), nullable=False)
    score = db.Column(db.Float, nullable=False)
    
    def __repr__(self):
        return f'<TestResult Student:{self.student_id} Test:{self.test_id} Score:{self.score}>'
