from flask import Blueprint, request, jsonify
from services.ai_service import get_ai_recommendations
import logging

ai = Blueprint('ai', __name__)


@ai.route('/study-helper', methods=['POST'])
def study_helper():
    try:
        data = request.get_json()
        student_id = data.get('studentId')
        topics = data.get('topics')
        if not student_id or not topics:
            return jsonify({'message': 'Invalid data'}), 400

        # Get AI-based study recommendations
        recommendations = get_ai_recommendations(student_id, topics)
        return jsonify(recommendations), 200
    except Exception as e:
        logging.error(f"Error getting AI study recommendations: {str(e)}")
        return jsonify({'message': 'Failed to get recommendations'}), 500
