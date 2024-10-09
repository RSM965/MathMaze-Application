import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChildPerformance } from '../../redux/actions/parentActions';
import PerformanceChart from '../../components/common/PerformanceChart';
import { useParams } from 'react-router-dom';

const ChildPerformance = () => {
  const { student_id } = useParams();
  const dispatch = useDispatch();
  const reports = useSelector((state) => state.parent.childPerformance);

  useEffect(() => {
    dispatch(fetchChildPerformance(student_id));
  }, [dispatch, student_id]);

  if (!reports.length) return <div className="text-center text-blue-600 font-semibold mt-10">Loading performance data...</div>;

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Child Performance Overview</h1>
        <p className="text-gray-600 mb-6">
          Review your child's progress and analyze their test performance to support their learning journey.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg mb-10">
        <PerformanceChart performance_reports={reports} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.report_id} className="border p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105 bg-white">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Test ID: {report.test_id}</h2>
            <p className="text-gray-600 mb-2">Date Taken: {new Date(report.date_taken).toLocaleString()}</p>
            <p className="text-gray-700 font-medium">Total Score: {report.total_score}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChildPerformance;
