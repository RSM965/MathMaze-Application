// src/redux/actions/teacherActions.js
import axios from '../../utils/axiosConfig';

export const fetchEnrolledStudents = () => async (dispatch, getState) => {
  try {
    const { user } = getState().auth;
    const teacher_id = user.user_id;
    const res = await axios.get(`/api/teachers/${teacher_id}/enrolled_students`);
    console.log(res.data.classes)
    dispatch({ type: 'FETCH_ENS_SUCCESS', payload: res.data.students });
  } catch (error) {
    dispatch({ type: 'FETCH_ENS_FAIL', payload: error.response?.data || error.message });
  }
};
export const fetchEnrolledParents = () => async (dispatch, getState) => {
  try {
    const { user } = getState().auth;
    const teacher_id = user.user_id;
    const res = await axios.get(`/api/teachers/${teacher_id}/enrolled_parents`);
    console.log(res.data.classes)
    dispatch({ type: 'FETCH_ENP_SUCCESS', payload: res.data.parents });
  } catch (error) {
    dispatch({ type: 'FETCH_ENP_FAIL', payload: error.response?.data || error.message });
  }
};

export const  fetchClasses= () => async (dispatch, getState) => {
  try {
    const { user } = getState().auth;
    const teacher_id = user.user_id;
    const res = await axios.get(`/api/teachers/${teacher_id}/classes`);
    console.log(res.data.classes)
    dispatch({ type: 'FETCH_CLASSES_SUCCESS', payload: res.data.classes });
  } catch (error) {
    dispatch({ type: 'FETCH_CLASSES_FAIL', payload: error.response?.data || error.message });
  }
};

export const createClass = (classData) => async (dispatch, getState) => {
  try {
    const { user } = getState().auth;
    const teacher_id = user.user_id;
    const res = await axios.post(`/api/teachers/${teacher_id}/classes`, classData);
    console.log(classData,res.data)
    res.data.class_name=classData.class_name
    res.data.categories=classData.categories
    dispatch({ type: 'CREATE_CLASS_SUCCESS', payload: res.data });
  } catch (error) {
    dispatch({ type: 'CREATE_CLASS_FAIL', payload: error.response?.data || error.message });
  }
};

export const updateClass = (class_id, classData) => async (dispatch, getState) => {
  try {
    const { user } = getState().auth;
    const teacher_id = user.user_id;
    const res = await axios.put(`/api/teachers/${teacher_id}/classes/${class_id}`, classData);
    dispatch({ type: 'UPDATE_CLASS_SUCCESS', payload: res.data.class });
  } catch (error) {
    dispatch({ type: 'UPDATE_CLASS_FAIL', payload: error.response?.data || error.message });
  }
};

export const deleteClass = (class_id) => async (dispatch, getState) => {
  try {
    const { user } = getState().auth;
    const teacher_id = user.user_id;
    await axios.delete(`/api/teachers/${teacher_id}/classes/${class_id}`);
    dispatch({ type: 'DELETE_CLASS_SUCCESS', payload: class_id });
  } catch (error) {
    dispatch({ type: 'DELETE_CLASS_FAIL', payload: error.response?.data || error.message });
  }
};

export const fetchTests = (class_id) => async (dispatch, getState) => {
  try {
    const { user } = getState().auth;
    const teacher_id = user.user_id;
    const res = await axios.get(`/api/teachers/${teacher_id}/classes/${class_id}/tests`);
    dispatch({ type: 'FETCH_TESTS_SUCCESS', payload: res.data.tests });
  } catch (error) {
    dispatch({ type: 'FETCH_TESTS_FAIL', payload: error.response?.data || error.message });
  }
};

export const createTest = (class_id, testData) => async (dispatch, getState) => {
  try {
    const { user } = getState().auth;
    const teacher_id = user.user_id;
    const res = await axios.post(
      `/api/teachers/${teacher_id}/classes/${class_id}/tests`,
      testData
    );
    dispatch({ type: 'CREATE_TEST_SUCCESS', payload: res.data.test });
  } catch (error) {
    dispatch({ type: 'CREATE_TEST_FAIL', payload: error.response?.data || error.message });
  }
};

export const updateTest = (class_id, test_id, testData) => async (dispatch, getState) => {
  try {
    const { user } = getState().auth;
    const teacher_id = user.user_id;
    const res = await axios.put(
      `/api/teachers/${teacher_id}/classes/${class_id}/tests/${test_id}`,
      testData
    );
    dispatch({ type: 'UPDATE_TEST_SUCCESS', payload: res.data.test });
  } catch (error) {
    dispatch({ type: 'UPDATE_TEST_FAIL', payload: error.response?.data || error.message });
  }
};

export const deleteTest = (class_id, test_id) => async (dispatch, getState) => {
  try {
    const { user } = getState().auth;
    const teacher_id = user.user_id;
    await axios.delete(`/api/teachers/${teacher_id}/classes/${class_id}/tests/${test_id}`);
    dispatch({ type: 'DELETE_TEST_SUCCESS', payload: test_id });
  } catch (error) {
    dispatch({ type: 'DELETE_TEST_FAIL', payload: error.response?.data || error.message });
  }
};

export const sendFeedback = (feedbackData) => async (dispatch, getState) => {
  try {
    const { user } = getState().auth;
    const teacher_id = user.user_id;
    await axios.post(`/api/teachers/${teacher_id}/feedback`, feedbackData);
    dispatch({ type: 'SEND_FEEDBACK_SUCCESS' });
  } catch (error) {
    dispatch({ type: 'SEND_FEEDBACK_FAIL', payload: error.response?.data || error.message });
  }
};

export const fetchFeedback = () => async (dispatch, getState) => {
  try {
    const { user } = getState().auth;
    const teacher_id = user.user_id;
    const res = await axios.get(`/api/teachers/${teacher_id}/feedback`);
    dispatch({ type: 'FETCH_FEEDBACK_SUCCESS', payload: res.data.sent_feedback });
  } catch (error) {
    dispatch({ type: 'FETCH_FEEDBACK_FAIL', payload: error.response?.data || error.message });
  }
};
