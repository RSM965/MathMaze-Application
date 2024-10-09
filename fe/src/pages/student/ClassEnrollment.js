import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchAvailableClasses,
  enrollInClass,
} from '../../redux/actions/studentActions';
import { useNavigate } from 'react-router-dom';

const ClassEnrollment = () => {
  const dispatch = useDispatch();
  const availableClasses = useSelector((state) => state.student.availableClasses);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAvailableClasses());
  }, [dispatch]);

  const handleEnroll = (class_id) => {
    dispatch(enrollInClass(class_id));
    navigate('/student/dashboard');
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Available Classes</h1>
        <p className="text-gray-600 mb-6">
          Browse the available classes and enroll to start learning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableClasses.length > 0 ? (
          availableClasses.map((cls) => (
            <div key={cls.class_id} className="border p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105 bg-white">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{cls.class_name}</h2>
              <p className="text-gray-600 mb-6">
                Enroll in this class to gain new knowledge and enhance your skills.
              </p>
              <div className="flex justify-center">
                <button
                  className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-2 rounded-full transition duration-300"
                  onClick={() => handleEnroll(cls.class_id)}
                >
                  Enroll
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-700 font-medium">
            No classes available at the moment. Please check back later.
          </p>
        )}
      </div>
    </div>
  );
};

export default ClassEnrollment;
