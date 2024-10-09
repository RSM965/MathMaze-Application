// src/pages/parent/ParentDashboard.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChildren,downloadReportCard } from '../../redux/actions/parentActions';
import { useNavigate } from 'react-router-dom';

const ParentDashboard = () => {
  const dispatch = useDispatch();
  const children = useSelector((state) => state.parent.children);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchChildren());
  }, [dispatch]);

  const handleViewPerformance = (student_id) => {
    navigate(`/parent/child/${student_id}/performance`);
  };

  const handleDownloadReportCard = (student_id) => {
    dispatch(downloadReportCard(student_id));
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl mb-6">Parent Dashboard</h1>
      {children.map((child) => (
        <div key={child.student_id} className="border p-4 mb-4 rounded">
          <h2 className="text-xl">{child.name}</h2>
          <div className="mt-2">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
              onClick={() => handleViewPerformance(child.student_id)}
            >
              View Performance
            </button>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => handleDownloadReportCard(child.student_id)}
            >
              Download Report Card
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ParentDashboard;
