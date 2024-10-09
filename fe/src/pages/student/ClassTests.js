// src/pages/student/ClassTests.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTests } from '../../redux/actions/studentActions';
import { useParams, Link } from 'react-router-dom';

const ClassTests = () => {
  const { class_id } = useParams();
  const dispatch = useDispatch();
  const tests = useSelector((state) => state.student.tests);

  useEffect(() => {
    dispatch(fetchTests(class_id));
  }, [dispatch, class_id]);

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl mb-6">Tests for Class {class_id}</h1>
      {tests.map((test) => (
        <div key={test.test_id} className="border p-4 mb-4 rounded">
          <h2 className="text-xl">{test.test_name}</h2>
          <div className="mt-2">
            <Link
              to={`/student/class/${class_id}/test/${test.test_id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Take Test
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassTests;
