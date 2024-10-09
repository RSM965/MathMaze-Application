// src/pages/Register.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../redux/actions/authActions";
import { useNavigate } from "react-router-dom";



const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pemail, setParentEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ username, email, password, role,pemail},  navigate));
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
        {role==='Student'?(<div className="mb-4">
          <label className="block">Parent Email</label>
          <input
            type="pemail"
            value={pemail}
            onChange={(e) => setParentEmail(e.target.value)}
            className="border p-2 w-full rounded"
            required/></div>):(<div></div>)}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
