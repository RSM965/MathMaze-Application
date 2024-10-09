// src/pages/student/PerformanceReports.js

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPerformanceReports } from '../../redux/actions/studentActions';
import PerformanceChart from '../../components/common/PerformanceChart';

const PerformanceReports = () => {
  const dispatch = useDispatch();

  // Access performance reports, loading, and error states from Redux store
  const { performanceReports, loading, error } = useSelector(
    (state) => state.student
  );

  useEffect(() => {
    // Dispatch action to fetch performance reports when component mounts
    dispatch(fetchPerformanceReports());
  }, [dispatch]);

  // Ensure performance_reports is an array to prevent undefined errors
  const reportsArray = Array.isArray(performanceReports)
    ? performanceReports
    : [];
  const available= reportsArray.length===0 ? true:false
  console.log(reportsArray)
  console.log("Report",performanceReports)
  return (
    <div className="container mx-auto mt-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Your Performance Reports</h1>

      
    {/* Error Message */}
      {error && (
        <p className="text-red-600">
          {typeof error === 'string'
            ? error
            : error.message || 'An error occurred while fetching performance reports.'}
        </p>
      )}

      {/* Performance Chart */}
      {loading && !error && reportsArray.length > 0 ? (
        <PerformanceChart performance_reports={reportsArray}/>
      ) : (
        available && <p className="text-gray-700">No performance reports available.</p>
      )}
    </div>
  );
};

export default PerformanceReports;
