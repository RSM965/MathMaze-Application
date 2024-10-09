// src/pages/parent/ReportCard.js
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
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl mb-6">Downloading Report Card...</h1>
      <p>If the download doesn't start automatically, please check your browser settings.</p>
    </div>
  );
};

export default ReportCard;
