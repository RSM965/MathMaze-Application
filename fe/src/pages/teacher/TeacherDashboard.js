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
    <div className="container mx-auto mt-10 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Teacher Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Manage your classes, create new ones, and organize tests to help students succeed.
        </p>
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
          onClick={() => setIsModalOpen(true)}
        >
          Create New Class
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Class">
        <CreateClassForm onClose={() => setIsModalOpen(false)} />
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.length > 0 ? (
          classes.map((cls) => (
            <div key={cls.class_id} className="border p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105 bg-white">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{cls.class_name}</h2>
              <p className="text-gray-600 mb-6">
                Manage this class to add, update, or delete tests for your students.
              </p>
              <div className="flex justify-between">
                <button
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-full transition duration-300"
                  onClick={() => handleManageTests(cls.class_id)}
                >
                  Manage Tests
                </button>
                <button
                  className="bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-full transition duration-300"
                  onClick={() => handleDeleteClass(cls.class_id)}
                >
                  Delete Class
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-700 font-medium">No classes available. Create a new one to get started.</p>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
