// src/pages/student/StudentDashboard.js

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchEnrolledClasses,
  fetchRecommendedClasses,
} from '../../redux/actions/studentActions';
import { useNavigate } from 'react-router-dom';
import Chatbot from '../../components/common/ChatBot';
import StudyHelper from './StudyHelper';
import RecommendedClassCard from './RecommendedClassCard';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const classes = useSelector((state) => state.student.classes);
  const loadingClasses = useSelector((state) => state.student.loadingClasses);
  const errorClasses = useSelector((state) => state.student.errorClasses);

  const recommendedClasses = useSelector((state) => state.student.recommendedClasses);
  const loadingRecommended = useSelector((state) => state.student.loadingRecommended);
  const errorRecommended = useSelector((state) => state.student.errorRecommended);

  const studentId = useSelector((state) => state.auth.user.user_id);

  useEffect(() => {
    dispatch(fetchEnrolledClasses());
    if (studentId) {
      dispatch(fetchRecommendedClasses(studentId));
    }
  }, [dispatch, studentId]);

  const handleViewTests = (class_id) => {
    navigate(`/student/class/${class_id}/tests`);
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      {/* Header and Enroll Button */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Student Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Manage your classes, enroll in new ones, and keep track of your progress.
        </p>
        <button
          className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
          onClick={() => navigate('/student/enroll')}
        >
          Enroll in Class
        </button>
      </div>

      {/* Enrolled Classes */}
      {loadingClasses && (
        <p className="text-center text-blue-600 font-semibold">Loading classes...</p>
      )}

      {errorClasses && (
        <p className="text-center text-red-600 font-semibold">
          {typeof errorClasses === 'string'
            ? errorClasses
            : errorClasses.message || 'An error occurred.'}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes && classes.length > 0 ? (
          classes.map((cls) => (
            <div
              key={cls.class_id}
              className="border p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105 bg-white"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{cls.class_name}</h2>
              <p className="text-gray-600 mb-6">
                Explore the class and take part in the tests to enhance your skills.
              </p>
              <button
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-full transition duration-300 w-full"
                onClick={() => handleViewTests(cls.class_id)}
              >
                View Tests
              </button>
            </div>
          ))
        ) : (
          !loadingClasses && (
            <p className="text-center text-gray-700 font-medium">No classes enrolled yet.</p>
          )
        )}
      </div>

      {/* Recommended Classes Section */}
      <div className="mt-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Recommended Classes for You</h2>
        {loadingRecommended && (
          <p className="text-center text-blue-600 font-semibold">Loading recommendations...</p>
        )}
        {errorRecommended && (
          <p className="text-center text-red-600 font-semibold">
            {typeof errorRecommended === 'string'
              ? errorRecommended
              : errorRecommended.message || 'An error occurred.'}
          </p>
        )}
        {recommendedClasses && recommendedClasses.length > 0 ? (
          <div className="flex space-x-4 overflow-x-auto py-4">
            {recommendedClasses.map((recClass) => (
              <div key={recClass.class_id} className="flex-shrink-0">
                <RecommendedClassCard classData={recClass} />
              </div>
            ))}
          </div>
        ) : (
          !loadingRecommended && (
            <p className="text-center text-gray-700 font-medium">
              {classes && classes.length === 0
                ? 'No recommendations available at this time.'
                : 'You have enrolled in all available classes.'}
            </p>
          )
        )}
      </div>

      {/* Chatbot and Study Helper */}
      <div className="mt-10">
        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
          <Chatbot user_id={studentId}/>
        </div>
      </div>

      <div className="mt-10">
        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-400">
          <div className="flex items-center justify-center mb-4">
            <i className="fas fa-robot text-4xl text-blue-500 mr-3"></i>
            <h3 className="text-2xl font-bold text-gray-800">AI Study Helper</h3>
          </div>
          <p className="text-gray-600 mb-6 text-center">
            Enhance your learning with personalized study guidance. Your AI Study Helper is here to
            support you.
          </p>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <StudyHelper studentId={studentId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
