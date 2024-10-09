// src/redux/actions/authActions.js
import axios from '../../utils/axiosConfig';

export const registerUser = (userData, navigate) => async (dispatch) => {
  try {
    const res = await axios.post('/api/auth/register', userData);
    dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
    navigate('/login');
  } catch (error) {
    let errorMessage = 'An error occurred during registration.';
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || error.response.data;
    }
    dispatch({ type: 'REGISTER_FAIL', payload: errorMessage });
  }
};

export const loginUser = (credentials, navigate) => async (dispatch) => {
  try {
    const res = await axios.post('/api/auth/login', credentials);
    const { token, role, user_id } = res.data;
    const user = { role, user_id };

    // Store the token in localStorage
    localStorage.setItem('token', token);

    // Set the default Authorization header for future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user } });
    navigate(`/${role.toLowerCase()}/dashboard`);
  } catch (error) {
    let errorMessage = 'An error occurred during login.';
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || error.response.data;
    }
    dispatch({ type: 'LOGIN_FAIL', payload: errorMessage });
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
  dispatch({ type: 'LOGOUT' });
};
