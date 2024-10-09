from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

def role_required(required_role):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            identity = get_jwt_identity()
            if identity['role'] != required_role:
                return jsonify({'message': 'Unauthorized'}), 403
            return f(*args, **kwargs)
        return wrapper
    return decorator
