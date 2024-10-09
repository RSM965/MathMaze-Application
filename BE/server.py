from flask import Flask
from dotenv import load_dotenv
from routes.ai import ai  # Assuming ai.py is in the folder named 'routes'

load_dotenv()

app = Flask(__name__)

# Register the blueprint
app.register_blueprint(ai, url_prefix='/api/ai')

if __name__ == '__main__':
    app.run(port=5000, debug=True)
