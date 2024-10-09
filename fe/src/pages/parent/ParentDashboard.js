import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChildren, downloadReportCard } from '../../redux/actions/parentActions';
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
    <div className="container mx-auto mt-10 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Parent Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Track your children's academic progress and download their report cards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.length > 0 ? (
          children.map((child) => (
            <div key={child.student_id} className="border p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105 bg-white">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{child.name}</h2>
              <p className="text-gray-600 mb-6">Monitor performance and get detailed progress reports.</p>
              <div className="flex justify-between">
                <button
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-full transition duration-300"
                  onClick={() => handleViewPerformance(child.student_id)}
                >
                  View Performance
                </button>
                <button
                  className="bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-2 rounded-full transition duration-300"
                  onClick={() => handleDownloadReportCard(child.student_id)}
                >
                  Download Report Card
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-700 font-medium">No children enrolled. Please contact the school administration for updates.</p>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
