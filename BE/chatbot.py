import os
from groq import Groq
# app/chatbot.py
from models import Student,Category,PerformanceReport
def getCats(user_id):
    interested_cats=Student.query.filter_by(student_id=user_id).first().interest_categories
    return [i.category_name for i in interested_cats]
def getResults(user_id):
    performance_reports = PerformanceReport.query.filter_by(student_id=user_id).all()
    reports_data =[
    {
            'report_id': report.report_id,
            'test_id': report.test_id,
            'scores': [{Category.query.filter_by(category_id=i).first().category_name:j} for i,j in report.scores.items()],
        }
        for report in performance_reports
    ]
    return reports_data
def getHistory(user_input,user_id,history):
    getCats(user_id)
    getResults(user_id)
    with open('./Prompt.txt','r') as f:
        sys_prompt=f.read()
    arr=[{
            "role":"system",
            "content":sys_prompt.replace('{tpc}',str(getCats(user_id))).replace('{res}',str(getResults(user_id)))
        }]
    if history:
        for i in history:
            arr.append({'role':"user","content":i})
    arr.append({'role':'user',"content":user_input})
    return arr
def get_response(user_input,user_id,history):
    # Placeholder for chatbot logic
   
    client = Groq(
    api_key= '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',
    )
    
    chat_completion = client.chat.completions.create(
    messages=getHistory(user_input,user_id,history),
    model="llama3-70b-8192",
    )
    return chat_completion.choices[0].message.content
