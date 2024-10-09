import os
from groq import Groq
# app/chatbot.py
def getHistory(user_input,history):
    with open('./Prompt.txt','r') as f:
        sys_prompt=f.read()
    arr=[{
            "role":"system",
            "content":sys_prompt
        }]
    if history:
        for i in history:
            arr.append({'role':"user","content":i})
    arr.append({'role':'user',"content":user_input})
    return arr
def get_response(user_input,history):
    # Placeholder for chatbot logic
   
    client = Groq(
    api_key= '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',
    )
    
    chat_completion = client.chat.completions.create(
    messages=getHistory(user_input,history),
    model="llama3-70b-8192",
    )
    return chat_completion.choices[0].message.content
