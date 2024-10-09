// src/components/common/FeedbackList.js
import React from 'react';

const FeedbackList = ({ feedbackMessages }) => {
  console.log(feedbackMessages)
  return (
    <div>
      {feedbackMessages.map((feedback) => (
        <div key={feedback.feedback_id} className="border p-4 mb-4 rounded">
          <p>{feedback.message}</p>
          <p className="text-sm text-gray-500">
            {(feedback.confidentiality)?feedback.confidentiality:'Teacher: '+feedback.from_user_name} {' '}
            {new Date(feedback.date_sent).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;
