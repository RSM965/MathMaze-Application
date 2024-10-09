import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Chatbot from '../../components/common/ChatBot';
import { fetchEnrolledClasses } from '../../redux/actions/studentActions';
import { useNavigate } from 'react-router-dom';
import StudyHelper from './StudyHelper';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const classes = useSelector((state) => state.student.classes);
  const loading = useSelector((state) => state.student.loading);
  const error = useSelector((state) => state.student.error);

  useEffect(() => {
    dispatch(fetchEnrolledClasses());
  }, [dispatch]);

  const handleViewTests = (class_id) => {
    navigate(`/student/class/${class_id}/tests`);
  };

  const handleEnroll = () => {
    navigate('/student/enroll');
  };

  const classesArray = Array.isArray(classes) ? classes : [];

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl mb-6">Student Dashboard</h1>
      <button className="bg-green-600 text-white px-4 py-2 rounded mb-4" onClick={handleEnroll}>
        Enroll in Class
      </button>
      {loading && <p>Loading classes...</p>}
      {error && (
        <p className="text-red-600">
          {typeof error === 'string' ? error : error.message || 'An error occurred.'}
        </p>
      )}
      <div>
        {classesArray.length > 0 ? (
          classesArray.map((cls) => (
            <div key={cls.class_id} className="border p-4 mb-4 rounded">
              <h2 className="text-xl">{cls.class_name}</h2>
              <div className="mt-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded mr-2" onClick={() => handleViewTests(cls.class_id)}>
                  View Tests
                </button>
              </div>
            </div>
          ))
        ) : (
          !loading && <p>No classes enrolled yet.</p>
        )}
      </div>
      {/* Add Chatbot here */}
      <Chatbot />
      {/* Add AI Study Helper here */}
      <StudyHelper studentId={'studentId123'} />
    </div>
  );
};

export default StudentDashboard;
