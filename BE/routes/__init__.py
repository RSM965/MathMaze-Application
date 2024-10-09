def register_routes(app):
    from .auth_routes import auth_bp
    from .teacher_routes import teacher_bp
    from .student_routes import student_bp
    from .parent_routes import parent_bp
    from .misc_routes import misc_bp
    from .chatbot_routes import chatbot_bp  # Placeholder for future development

    app.register_blueprint(auth_bp)
    app.register_blueprint(teacher_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(parent_bp)
    app.register_blueprint(misc_bp)
    app.register_blueprint(chatbot_bp)
