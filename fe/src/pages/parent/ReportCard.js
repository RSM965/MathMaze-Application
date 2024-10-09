import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { downloadReportCard } from '../../redux/actions/parentActions';
import { useParams } from 'react-router-dom';

const ReportCard = () => {
  const { student_id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(downloadReportCard(student_id));
  }, [dispatch, student_id]);

  return (
    <div className="container mx-auto mt-20 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-6">Downloading Report Card...</h1>
        <p className="text-gray-600 mb-8">
          If the download doesn't start automatically, please check your browser settings.
        </p>
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-solid"></div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
