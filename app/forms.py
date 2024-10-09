# app/forms.py
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SelectField, SubmitField
from wtforms.validators import DataRequired, Length

class RegistrationForm(FlaskForm):
    def __init__(self, *args, **kwargs):
        super(RegistrationForm, self).__init__(*args, **kwargs)
        self.role.default = 'teacher'  # Set the default role to 'teacher'
        self.process()  # This will populate the field with the default value

    username = StringField('Username', validators=[DataRequired(), Length(min=2, max=150)])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6, max=150)])
    role = SelectField('Role', choices=[('student', 'Student'), ('teacher', 'Teacher')], validators=[DataRequired()])
    parent_username = StringField('Parent Username', validators=[DataRequired(), Length(min=2, max=150)])  # For student registration
    parent_password = PasswordField('Parent Password', validators=[DataRequired(), Length(min=6, max=150)])  # For student registration
    submit = SubmitField('Register')
