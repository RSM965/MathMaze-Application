import os
import requests
import logging
import dotenv

from dotenv import load_dotenv
load_dotenv()
# Load environment variables
AZURE_OPENAI_ENDPOINT = os.getenv('AZURE_OPENAI_ENDPOINT')  # e.g., "https://edu-openai-service.openai.azure.com"
AZURE_OPENAI_API_KEY = os.getenv('AZURE_OPENAI_API_KEY')  # Get this from Azure portal
DEPLOYMENT_NAME = os.getenv('AZURE_DEPLOYMENT_NAME')  # Replace with your deployment name

logging.basicConfig(level=logging.INFO)


def get_ai_recommendations(student_id, topics):
    try:
        prompt = f"Provide study resources and tips for the following topics: {', '.join(topics)}"

        headers = {
            'Content-Type': 'application/json',
            'api-key': AZURE_OPENAI_API_KEY,
        }

        request_body = {
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 150,
        }

        # Correct API endpoint for gpt-35-turbo-16k deployment
        url = f"{AZURE_OPENAI_ENDPOINT}/openai/deployments/{DEPLOYMENT_NAME}/chat/completions?api-version=2024-06-01"
        logging.info(f"Making request to Azure OpenAI: {url}")
        logging.info(f"Request Headers: {headers}")
        logging.info(f"Request Body: {request_body}")

        response = requests.post(url, headers=headers, json=request_body)

        response_data = response.json()

        # Log the response for debugging
        logging.info(f"Azure Response Status Code: {response.status_code}")
        logging.info(f"Azure Response: {response_data}")

        if response.status_code == 200 and "choices" in response_data:
            return response_data["choices"][0]["message"]["content"].strip().split('\n')
        else:
            raise ValueError(
                f"Failed to fetch recommendations, Status Code: {response.status_code}, Response: {response_data}")

    except Exception as e:
        logging.error(f"Error in get_ai_recommendations: {str(e)}")
        raise e
