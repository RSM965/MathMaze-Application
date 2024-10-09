import os
from groq import Groq
# app/chatbot.py
def get_response(user_input):
    # Placeholder for chatbot logic
   
    client = Groq(
    api_key= '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',
    )
    chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": f"{user_input}",
        }
    ],
    model="llama3-70b-8192",
    )
    return chat_completion.choices[0].message.content
