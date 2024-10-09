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
    if (role === 'Teacher') return state.teacher.feedback;
    if (role === 'Student') return state.student.feedback;
    if (role === 'Parent') return state.parent.feedback;
    return [];
  });

  useEffect(() => {
    if (role === 'Teacher') dispatch(fetchTeacherFeedback());
    if (role === 'Student') dispatch(fetchStudentFeedback());
    if (role === 'Parent') dispatch(fetchParentFeedback());
  }, [dispatch, role]);

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Feedback</h1>
        <p className="text-gray-600 mb-6">
          View and share feedback to improve your learning and teaching experiences.
        </p>
        {(role === 'Teacher' || role === 'Student') && (
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
            onClick={() => setIsModalOpen(true)}
          >
            Send Feedback
          </button>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Send Feedback">
        <FeedbackForm role={role} onClose={() => setIsModalOpen(false)} />
      </Modal>

      <div className="bg-white p-8 rounded-xl shadow-lg mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Feedback Received</h2>
        <FeedbackList feedbackMessages={feedbackMessages} />
      </div>
    </div>
  );
};

export default FeedbackPage;
