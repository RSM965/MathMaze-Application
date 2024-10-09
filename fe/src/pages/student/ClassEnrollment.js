// src/pages/student/ClassEnrollment.js
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
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl mb-6">Available Classes</h1>
      <div>
        {availableClasses.map((cls) => (
          <div key={cls.class_id} className="border p-4 mb-4 rounded">
            <h2 className="text-xl">{cls.class_name}</h2>
            <div className="mt-2">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => handleEnroll(cls.class_id)}
              >
                Enroll
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassEnrollment;
