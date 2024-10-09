// src/pages/parent/ChildPerformance.js
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

  if (!reports.length) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl mb-6">Child Performance</h1>
      <PerformanceChart performance_reports={reports}/>
      <div className="mt-6">
        {reports.map((report) => (
          <div key={report.report_id} className="border p-4 mb-4 rounded">
            <h2 className="text-xl">Test ID: {report.test_id}</h2>
            <p>Date Taken: {new Date(report.date_taken).toLocaleString()}</p>
            <p>Total Score: {report.total_score}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChildPerformance;
