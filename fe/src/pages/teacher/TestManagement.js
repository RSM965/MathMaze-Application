import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTests, deleteTest } from '../../redux/actions/teacherActions';
import CreateTestForm from '../../components/teacher/CreateTestForm';
import Modal from '../../components/common/Modal';
import { useParams } from 'react-router-dom';

const TestManagement = () => {
  const { class_id } = useParams();
  const dispatch = useDispatch();
  const tests = useSelector((state) => state.teacher.tests);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTests(class_id));
  }, [dispatch, class_id]);

  const handleDeleteTest = (test_id) => {
    dispatch(deleteTest(class_id, test_id));
  };

  // Ensure tests is an array
  const testsArray = Array.isArray(tests) ? tests : [];

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Test Management</h1>
        <p className="text-gray-600 mb-6">
          Create and manage tests for the class to help students succeed.
        </p>
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
          onClick={() => setIsModalOpen(true)}
        >
          Create New Test
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Test">
        <CreateTestForm classId={class_id} onClose={() => setIsModalOpen(false)} />
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testsArray.length > 0 ? (
          testsArray.map((test) => {
            if (!test || typeof test.test_name === 'undefined') {
              return (
                <div key={test?.test_id || Math.random()} className="border p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105 bg-white">
                  <p className="text-red-600 font-semibold">Invalid test data.</p>
                </div>
              );
            }
            return (
              <div key={test.test_id} className="border p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105 bg-white">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{test.test_name}</h2>
                <p className="text-gray-600 mb-6">Manage or delete this test to keep your class up-to-date.</p>
                <div className="flex justify-end">
                  <button
                    className="bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-full transition duration-300"
                    onClick={() => handleDeleteTest(test.test_id)}
                  >
                    Delete Test
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-700 font-medium">No tests available for this class. Create one to get started.</p>
        )}
      </div>
    </div>
  );
};

export default TestManagement;
