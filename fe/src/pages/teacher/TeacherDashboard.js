// src/pages/teacher/TeacherDashboard.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClasses, deleteClass } from '../../redux/actions/teacherActions';
import CreateClassForm from '../../components/teacher/CreateClassForm';
import Modal from '../../components/common/Modal';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const classes = useSelector((state) => state.teacher.classes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  const handleDeleteClass = (class_id) => {
    dispatch(deleteClass(class_id));
  };

  const handleManageTests = (class_id) => {
    navigate(`/teacher/class/${class_id}/tests`);
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl mb-6">Teacher Dashboard</h1>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Create New Class
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Class">
        <CreateClassForm onClose={() => setIsModalOpen(false)} />
      </Modal>
      <div>
        {classes.map((cls) => (
          <div key={cls.class_id} className="border p-4 mb-4 rounded">
            <h2 className="text-xl">{cls.class_name}</h2>
            <div className="mt-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
                onClick={() => handleManageTests(cls.class_id)}
              >
                Manage Tests
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => handleDeleteClass(cls.class_id)}
              >
                Delete Class
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;
