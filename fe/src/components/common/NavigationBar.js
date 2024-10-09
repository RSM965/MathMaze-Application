// src/components/common/NavigationBar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/actions/authActions';

const NavigationBar = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const role = auth.user ? auth.user.role : null;

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-800 p-5 shadow-lg text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Updated Logo with Increased Size */}
          <img src="/static/logo.png" alt="MathMaze Logo" className="h-14 w-14 mr-3" />
          <Link to="/" className="text-3xl font-extrabold tracking-widest hover:text-yellow-400 transition duration-300">
            MathMaze
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/about" className="text-lg hover:text-yellow-400 transition duration-300">
            About Us
          </Link>
          {auth.isAuthenticated ? (
            <>
              {role === 'Teacher' && (
                <>
                  <Link to="/teacher/dashboard" className="text-lg hover:text-yellow-400 transition duration-300">
                    Dashboard
                  </Link>
                  <Link to="/teacher/feedback" className="text-lg hover:text-yellow-400 transition duration-300">
                    Feedback
                  </Link>
                </>
              )}
              {role === 'Student' && (
                <>
                  <Link to="/student/dashboard" className="text-lg hover:text-yellow-400 transition duration-300">
                    Dashboard
                  </Link>
                  <Link to="/student/performance" className="text-lg hover:text-yellow-400 transition duration-300">
                    Performance
                  </Link>
                  <Link to="/student/feedback" className="text-lg hover:text-yellow-400 transition duration-300">
                    Feedback
                  </Link>
                </>
              )}
              {role === 'Parent' && (
                <>
                  <Link to="/parent/dashboard" className="text-lg hover:text-yellow-400 transition duration-300">
                    Dashboard
                  </Link>
                  <Link to="/parent/feedback" className="text-lg hover:text-yellow-400 transition duration-300">
                    Feedback
                  </Link>
                </>
              )}
              <button onClick={handleLogout} className="ml-4 bg-red-600 px-5 py-2 rounded-full font-semibold hover:bg-red-500 transition duration-300">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-lg hover:text-yellow-400 transition duration-300">
                Login
              </Link>
              <Link to="/register" className="text-lg hover:text-yellow-400 transition duration-300">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
