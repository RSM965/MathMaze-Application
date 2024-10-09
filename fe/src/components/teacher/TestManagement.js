// src/pages/teacher/TestManagement.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// Import necessary actions
import { fetchTests, createTest } from "../../redux/actions/teacherActions";
import { useParams } from "react-router-dom";
import Modal from "../../components/common/Modal";
import CreateTestForm from "../../components/teacher/CreateTestForm";

const TestManagement = () => {
  const { class_id } = useParams();
  const dispatch = useDispatch();
  const tests = useSelector((state) => state.teacher.tests);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTests(class_id));
  }, [dispatch, class_id]);

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
        {tests.map((test) => (
          <div key={test.test_id} className="border p-4 mb-4 rounded">
            <h2 className="text-xl">{test.test_name}</h2>
            <div className="mt-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
                // Add onClick to navigate to Question Management
              >
                Manage Questions
              </button>
              <button
                className="bg-yellow-600 text-white px-4 py-2 rounded mr-2"
                // Add onClick to navigate to Edit Test
              >
                Edit Test
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                // Add onClick to delete test
              >
                Delete Test
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestManagement;
