from flask import Blueprint, request, jsonify

chatbot_bp = Blueprint('chatbot_bp', __name__, url_prefix='/api')

@chatbot_bp.route('/chatbot', methods=['POST'])
def chatbot_interaction():
    data = request.get_json()
    message = data.get('message')

    # Placeholder reply
    reply = "This feature is under development."

    return jsonify({'reply': reply}), 200
