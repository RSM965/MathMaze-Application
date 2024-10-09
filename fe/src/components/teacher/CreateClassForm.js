// src/components/teacher/CreateClassForm.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createClass } from '../../redux/actions/teacherActions';

const CreateClassForm = ({ onClose }) => {
  const [className, setClassName] = useState('');
  const [categories, setCategories] = useState(['']);
  const dispatch = useDispatch();

  const handleCategoryChange = (index, value) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
  };

  const addCategoryField = () => {
    setCategories([...categories, '']);
  };

  const removeCategoryField = (index) => {
    const newCategories = categories.filter((_, idx) => idx !== index);
    setCategories(newCategories);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const classData = {
      class_name: className,
      categories: categories.filter((category) => category.trim() !== ''),
    };
    dispatch(createClass(classData));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block">Class Name</label>
        <input
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block">Categories</label>
        {categories.map((category, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={category}
              onChange={(e) => handleCategoryChange(index, e.target.value)}
              className="border p-2 w-full rounded"
              required
            />
            <button
              type="button"
              onClick={() => removeCategoryField(index)}
              className="ml-2 text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addCategoryField}
          className="text-blue-600 mt-2"
        >
          Add Category
        </button>
      </div>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Create Class
      </button>
    </form>
  );
};

export default CreateClassForm;
