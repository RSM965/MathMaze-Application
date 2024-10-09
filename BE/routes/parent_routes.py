from flask import Blueprint, request, jsonify, send_file
from models import Parent, Student, PerformanceReport, Feedback, db ,User , Test
from flask_jwt_extended import jwt_required, get_jwt_identity
from io import BytesIO
from reportlab.pdfgen import canvas  # For PDF generation

parent_bp = Blueprint('parent_bp', __name__, url_prefix='/api/parents')

def is_authorized_parent(parent_id):
    identity = get_jwt_identity()
    return identity['user_id'] == parent_id and identity['role'] == 'Parent'

@parent_bp.route('/<int:parent_id>/students', methods=['GET'])
@jwt_required()
def get_all_children(parent_id):
    if not is_authorized_parent(parent_id):
        return jsonify({'message': 'Unauthorized'}), 403
    try:
        parent = Parent.query.get(parent_id)
        parent_user = User.query.get(parent_id)
        email=parent_user.email
        children=Student.query.filter_by(parent_email=email).all()
        arr=[]
        for child in children:
            out_dict={'student_id':[],'name':[]}
            out_dict['student_id'].append(child.student_id)
            out_dict['name'].append(User.query.filter_by(user_id=child.student_id).first().username)
            arr.append(out_dict)
        return jsonify(arr), 200
    except:
        return jsonify({'message':'User not found'}), 400

@parent_bp.route('/<int:parent_id>/students/<int:student_id>/performance', methods=['GET'])
@jwt_required()
def view_child_performance(parent_id, student_id):
    if not is_authorized_parent(parent_id):
        return jsonify({'message': 'Unauthorized'}), 403

    parent = Parent.query.get(parent_id)
    student = Student.query.get(student_id)
    # if student not in parent.children:
    #     return jsonify({'message': 'Student not linked to parent'}), 403

    performance_reports = PerformanceReport.query.filter_by(student_id=student_id).all()
    reports_data = [
        {
            'report_id': report.report_id,
            'test_id': report.test_id,
            'class_id':Test.query.filter_by(test_id=report.test_id).first().class_id,
            'scores': report.scores,  # No change needed with PickleType
            'date_taken': report.date_taken
        }
        for report in performance_reports
    ]

    return jsonify({'performance_reports': reports_data}), 200

@parent_bp.route('/<int:parent_id>/feedback', methods=['GET'])
@jwt_required()
def view_teacher_feedback(parent_id):
    if not is_authorized_parent(parent_id):
        return jsonify({'message': 'Unauthorized'}), 403

    # Get feedback addressed to the parent
    feedbacks = Feedback.query.filter_by(to_user_id=parent_id, confidentiality='Parent').all()
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

@parent_bp.route('/<int:parent_id>/students/<int:student_id>/report-card', methods=['GET'])
@jwt_required()
def download_report_card(parent_id, student_id):
    if not is_authorized_parent(parent_id):
        return jsonify({'message': 'Unauthorized'}), 403

    parent = Parent.query.get(parent_id)
    student = Student.query.get(student_id)
    
    # Fetch performance data
    performance_reports = PerformanceReport.query.filter_by(student_id=student_id).all()

    # Generate PDF report card
    buffer = BytesIO()
    p = canvas.Canvas(buffer)

    p.drawString(100, 800, f"Report Card for Student ID: {student_id}")
    y_position = 780

    for report in performance_reports:
        p.drawString(100, y_position, f"Test ID: {report.test_id}, Date: {report.date_taken}")
        y_position -= 20
        for category_id, score in report.scores.items():
            p.drawString(120, y_position, f"Category ID: {category_id}, Score: {score}")
            y_position -= 20
        y_position -= 10

    p.showPage()
    p.save()
    buffer.seek(0)

    return send_file(buffer, as_attachment=True, download_name='report_card.pdf', mimetype='application/pdf')
