// src/redux/actions/miscActions.js
import axios from '../../utils/axiosConfig';

export const fetchAvailableClasses = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/classes');
    dispatch({ type: 'FETCH_AVAILABLE_CLASSES_SUCCESS', payload: res.data.classes });
  } catch (error) {
    dispatch({ type: 'FETCH_AVAILABLE_CLASSES_FAIL', payload: error.response?.data || error.message });
  }
};

export const fetchClassCategories = (class_id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/classes/${class_id}/categories`);
    dispatch({ type: 'FETCH_CLASS_CATEGORIES_SUCCESS', payload: res.data.categories });
  } catch (error) {
    dispatch({ type: 'FETCH_CLASS_CATEGORIES_FAIL', payload: error.response?.data || error.message });
  }
};

// New action to fetch all categories
export const fetchAllCategories = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/classes/categories');
    dispatch({ type: 'FETCH_ALL_CATEGORIES_SUCCESS', payload: res.data.categories });
  } catch (error) {
    dispatch({ type: 'FETCH_ALL_CATEGORIES_FAIL', payload: error.response?.data || error.message });
  }
};
