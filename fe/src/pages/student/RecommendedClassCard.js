// src/components/RecommendedClassCard.js

import React from 'react';
import { useDispatch } from 'react-redux';
import { enrollInClass } from '../../redux/actions/studentActions';

const RecommendedClassCard = ({ classData, isEnrolled }) => {
  const dispatch = useDispatch();

  const handleEnroll = () => {
    if (!isEnrolled) {
      dispatch(enrollInClass(classData.class_id));
    }
  };

  return (
    <div
      className={`relative group w-60 h-36 bg-gray-800 text-white rounded-md overflow-hidden shadow-md transform transition duration-300 ${
        !isEnrolled ? 'hover:scale-105 cursor-pointer' : 'cursor-default'
      }`}
      onClick={handleEnroll}
    >
      {/* Class image or placeholder */}
      {classData.image_url ? (
        <img
          src={classData.image_url}
          alt={classData.class_name}
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-80"></div>
      )}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
        <h3 className="text-lg font-semibold">{classData.class_name}</h3>
        <p className="text-sm">Teacher: {classData.teacher_name}</p>
      </div>
      {/* Enrolled or Categories pop-up on hover */}
      <div className="absolute inset-0 bg-black bg-opacity-75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {isEnrolled ? (
          <div className="px-4">
            <h4 className="text-lg font-bold">Enrolled</h4>
          </div>
        ) : (
          <div className="px-4">
            <h4 className="text-base font-bold mb-2">Categories</h4>
            <ul className="text-xs space-y-1">
              {classData.categories.map((category, index) => (
                <li key={index}>• {category}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedClassCard;
