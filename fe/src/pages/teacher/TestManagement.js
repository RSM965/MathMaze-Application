// src/pages/teacher/TestManagement.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTests, deleteTest } from '../../redux/actions/teacherActions';
import CreateTestForm from '../../components/teacher/CreateTestForm';
import Modal from '../../components/common/Modal';
import { useParams } from 'react-router-dom';

const TestManagement = () => {
  const { class_id } = useParams();
  const dispatch = useDispatch();
  const tests = useSelector((state) => state.teacher.tests);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  useEffect(() => {
    dispatch(fetchTests(class_id));
  }, [dispatch, class_id]);

  const handleDeleteTest = (test_id) => {
    dispatch(deleteTest(class_id, test_id));
  };

  // Ensure tests is an array
  const testsArray = Array.isArray(tests) ? tests : [];

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl mb-6">Test Management</h1>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Create New Test
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Test">
        <CreateTestForm classId={class_id} onClose={() => setIsModalOpen(false)} />
      </Modal>
      <div>
        {testsArray.length > 0 ? (
          testsArray.map((test) => {
            if (!test || typeof test.test_name === 'undefined') {
              return (
                <div key={test?.test_id || Math.random()} className="border p-4 mb-4 rounded">
                  <p className="text-red-600">Invalid test data.</p>
                </div>
              );
            }
            return (
              <div key={test.test_id} className="border p-4 mb-4 rounded">
                <h2 className="text-xl">{test.test_name}</h2>
                <div className="mt-2">
                  {/* Add any additional functionalities like editing tests here */}
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded"
                    onClick={() => handleDeleteTest(test.test_id)}
                  >
                    Delete Test
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p>No tests available for this class.</p>
        )}
      </div>
    </div>
  );
};

export default TestManagement;
