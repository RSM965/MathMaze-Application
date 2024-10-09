// src/pages/Register.js
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from "../redux/actions/authActions";
import { useNavigate } from "react-router-dom";
import axios from '../utils/axiosConfig';
import Select from 'react-select';  // Import react-select

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pemail, setParentEmail] = useState("");
  const [password, setPassword] = useState("");
  const [categories, setCategories] = useState([]);  // Available categories fetched from API
  const [selectedCategories, setSelectedCategories] = useState([]);  // Selected categories
  const [role, setRole] = useState("Student");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`/api/classes/categories`);
        const categoryOptions = res.data.categories.map(category => ({
          value: category.category_id,
          label: category.category_name
        }));
        setCategories(categoryOptions);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedCategoryIds = selectedCategories.map(category => category.value);
    const userData = {
      username, 
      email, 
      password, 
      role, 
      pemail: role === 'Student' ? pemail : null, 
      categories: selectedCategoryIds.length > 0 ? selectedCategoryIds : []  // Ensure request body has empty array if no categories
    };
    dispatch(registerUser(userData, navigate));
  };

  return (
    <div className="container mx-auto mt-10 max-w-md">
      <h1 className="text-2xl mb-6">Register</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label className="block">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
            <option value="Parent">Parent</option>
          </select>
        </div>

        {role === 'Student' && (
          <>
            <div className="mb-4">
              <label className="block">Parent Email</label>
              <input
                type="email"
                value={pemail}
                onChange={(e) => setParentEmail(e.target.value)}
                className="border p-2 w-full rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block">Categories</label>
              <Select
                isMulti
                options={categories}
                value={selectedCategories}
                onChange={setSelectedCategories}  // Handle selection change
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select or search categories..."
              />
            </div>
          </>
        )}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
