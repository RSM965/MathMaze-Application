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
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3"> {/* Space between logo and text */}
          {/* Updated Logo with Increased Size */}
          <img src="/static/logo.png" alt="MathMaze Logo" className="h-12 w-12" /> {/* Increased size */}
          <Link to="/" className="text-2xl font-bold">
            MathMaze
          </Link>
        </div>
        <div>
          <Link to="/about" className="mr-4">
            About Us
          </Link>
          {auth.isAuthenticated ? (
            <>
              {role === 'Teacher' && (
                <>
                  <Link to="/teacher/dashboard" className="mr-4">
                    Dashboard
                  </Link>
                  <Link to="/teacher/feedback" className="mr-4">
                    Feedback
                  </Link>
                </>
              )}
              {role === 'Student' && (
                <>
                  <Link to="/student/dashboard" className="mr-4">
                    Dashboard
                  </Link>
                  <Link to="/student/performance" className="mr-4">
                    Performance
                  </Link>
                  <Link to="/student/feedback" className="mr-4">
                    Feedback
                  </Link>
                </>
              )}
              {role === 'Parent' && (
                <>
                  <Link to="/parent/dashboard" className="mr-4">
                    Dashboard
                  </Link>
                  <Link to="/parent/feedback" className="mr-4">
                    Feedback
                  </Link>
                </>
              )}
              <button onClick={handleLogout} className="ml-4">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4">
                Login
              </Link>
              <Link to="/register" className="mr-4">
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
