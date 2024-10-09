// src/pages/common/FeedbackPage.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchFeedback as fetchTeacherFeedback,
} from '../../redux/actions/teacherActions';
import {
  fetchFeedback as fetchStudentFeedback,
} from '../../redux/actions/studentActions';
import {
  fetchFeedback as fetchParentFeedback,
} from '../../redux/actions/parentActions';
import Modal from '../../components/common/Modal';
import FeedbackForm from '../../components/common/FeedbackForm';
import FeedbackList from '../../components/common/FeedbackList';

const FeedbackPage = ({ role }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const feedbackMessages = useSelector((state) => {
    console.log('role',role)
    if (role === 'Teacher') return state.teacher.feedback;
    if (role === 'Student') return state.student.feedback;
    if (role === 'Parent') return state.parent.feedback;
    return [];
  });
  console.log(feedbackMessages)
  useEffect(() => {
    if (role === 'Teacher') dispatch(fetchTeacherFeedback());
    if (role === 'Student') dispatch(fetchStudentFeedback());
    if (role === 'Parent') dispatch(fetchParentFeedback());
  }, [dispatch, role]);

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl mb-6">Feedback</h1>
      {(role === 'Teacher' || role === 'Student') && (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
          onClick={() => setIsModalOpen(true)}
        >
          Send Feedback
        </button>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Send Feedback">
        <FeedbackForm role={role} onClose={() => setIsModalOpen(false)} />
      </Modal>
      {<FeedbackList feedbackMessages={feedbackMessages} />}
    </div>
  );
};

export default FeedbackPage;
