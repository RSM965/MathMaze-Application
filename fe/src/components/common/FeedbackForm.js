// src/components/common/FeedbackForm.js
import React, { useState,useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { fetchEnrolledStudents,fetchEnrolledParents } from '../../redux/actions/teacherActions';
import { sendFeedback as sendTeacherFeedback } from '../../redux/actions/teacherActions';
import { sendFeedback as sendStudentFeedback } from '../../redux/actions/studentActions';

const FeedbackForm = ({ role, onClose }) => {
  
  const [message, setMessage] = useState('');
  const [confidentiality, setConfidentiality] = useState('Student');
  const dispatch = useDispatch();
  const students = useSelector((state) => state.teacher.students);
  const parents = useSelector((state) => state.teacher.parents);
  useEffect(() => {
    dispatch(fetchEnrolledStudents());
    dispatch(fetchEnrolledParents());
  }, [dispatch]);
  console.log('Students:',students)
  const [toUserId, setToUserId] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    const feedbackData = {
      to_user_id: parseInt(toUserId),
      message,
      confidentiality,
    };
    if (role === 'Teacher') {
      dispatch(sendTeacherFeedback(feedbackData));
    } else if (role === 'Student') {
      dispatch(sendStudentFeedback({ to_user_id: parseInt(toUserId), message }));
    }
    onClose();
  };
  console.log('toUserID',toUserId)
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block">To User ID</label>
        <select
              value={toUserId}
              onChange={(e) =>
                setToUserId(e.target.value)
              }
              className="border p-2 w-full rounded"
              required
            >
              <option
                  key='' 
                  value=''
                >
                  Select Student/Parent
                </option>
                {(confidentiality==='Student')?(
                students.map((student) => (
                  <option
                    key={student.student_id}
                    value={student.student_id}
                  >
                    {student.student_name}
                  </option>
                ))):(parents.map((student) => (
                  <option
                    key={student.parent_id}
                    value={student.parent_id}
                  >
                    {student.parent_name}
                  </option>
                )))
              }
            </select>
      </div>
      <div className="mb-4">
        <label className="block">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
      </div>
      {role === 'Teacher' && (
        <div className="mb-4">
          <label className="block">Confidentiality</label>
          <select
            value={confidentiality}
            onChange={(e) => setConfidentiality(e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option value="Student">Student</option>
            <option value="Parent">Parent</option>
          </select>
        </div>
      )}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Send Feedback
      </button>
    </form>
  );
};

export default FeedbackForm;
