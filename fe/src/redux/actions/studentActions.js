// src/redux/actions/studentActions.js
import axios from '../../utils/axiosConfig';
export const fetchTests = (class_id) => async (dispatch, getState) => {
  try {
    dispatch({ type: 'FETCH_TESTS_REQUEST' });

    const { user } = getState().auth;
    const student_id = user.user_id;

    const res = await axios.get(`/api/students/${student_id}/classes/${class_id}/tests`);

    // Ensure the response has the expected structure
    if (res.data && Array.isArray(res.data.tests)) {
      dispatch({
        type: 'FETCH_TESTS_SUCCESS',
        payload: res.data.tests,
      });
    } else {
      dispatch({
        type: 'FETCH_TESTS_FAIL',
        payload: 'Invalid response structure',
      });
    }
  } catch (error) {
    dispatch({
      type: 'FETCH_TESTS_FAIL',
      payload: error.response?.data?.message || error.message,
    });
  }
};
export const fetchEnrolledClasses = () => async (dispatch, getState) => {
  try {
    const { user } = getState().auth;
    const student_id = user.user_id;
    const res = await axios.get(`/api/students/${student_id}/classes`);
    console.log(res)
    dispatch({ type: 'FETCH_ENROLLED_CLASSES_SUCCESS', payload: res.data.classes });
  } catch (error) {
    console.log(error)
    dispatch({ type: 'FETCH_ENROLLED_CLASSES_FAIL', payload: error.response?.data || error.message });
  }
};

export const fetchAvailableClasses = () => async (dispatch, getState) => {
  try {
    const res = await axios.get('/api/classes');
    dispatch({ type: 'FETCH_AVAILABLE_CLASSES_SUCCESS', payload: res.data.classes });
  } catch (error) {
    dispatch({ type: 'FETCH_AVAILABLE_CLASSES_FAIL', payload: error.response?.data || error.message });
  }
};

export const enrollInClass = (class_id) => async (dispatch, getState) => {
  try {
    const { user } = getState().auth;
    const student_id = user.user_id;
    await axios.post(`/api/students/${student_id}/classes/${class_id}/enroll`);
    dispatch({ type: 'ENROLL_IN_CLASS_SUCCESS', payload: class_id });
  } catch (error) {
    dispatch({ type: 'ENROLL_IN_CLASS_FAIL', payload: error.response?.data || error.message });
  }
};

export const fetchTestDetails = (test_id) => async (dispatch, getState) => {
  try {
    // Assuming there's an endpoint to fetch test details for a student
    const { user } = getState().auth;
    const student_id = user.user_id;
    const res = await axios.get(`/api/students/${student_id}/tests/${test_id}`);
    dispatch({ type: 'FETCH_TEST_DETAILS_SUCCESS', payload: res.data.test });
  } catch (error) {
    dispatch({ type: 'FETCH_TEST_DETAILS_FAIL', payload: error.response?.data || error.message });
  }
};

export const submitTest = (test_id, answers) => async (dispatch, getState) => {
  try {
    const { user } = getState().auth;
    const student_id = user.user_id;
    const res = await axios.post(`/api/students/${student_id}/tests/${test_id}/submit`, {
      answers,
    });
    dispatch({ type: 'SUBMIT_TEST_SUCCESS', payload: res.data.performance_report });
  } catch (error) {
    dispatch({ type: 'SUBMIT_TEST_FAIL', payload: error.response?.data || error.message });
  }
};

// export const fetchPerformanceReports = () => async (dispatch, getState) => {
//   try {
//     const { user } = getState().auth;
//     const student_id = user.user_id;
//     const res = await axios.get(`/api/students/${student_id}/performance`);
//     dispatch({ type: 'FETCH_PERFORMANCE_REPORTS_SUCCESS', payload: res.data.performance_reports });
//   } catch (error) {
//     dispatch({ type: 'FETCH_PERFORMANCE_REPORTS_FAIL', payload: error.response?.data || error.message });
//   }
// };

export const fetchFeedback = () => async (dispatch, getState) => {
  try {
    const { user } = getState().auth;
    const student_id = user.user_id;
    const res = await axios.get(`/api/students/${student_id}/feedback`);
    dispatch({ type: 'FETCH_FEEDBACK_SUCCESS', payload: res.data.feedback_messages });
  } catch (error) {
    dispatch({ type: 'FETCH_FEEDBACK_FAIL', payload: error.response?.data || error.message });
  }
};

export const sendFeedback = (feedbackData) => async (dispatch, getState) => {
  try {
    const { user } = getState().auth;
    const student_id = user.user_id;
    await axios.post(`/api/students/${student_id}/feedback`, feedbackData);
    dispatch({ type: 'SEND_FEEDBACK_SUCCESS' });
  } catch (error) {
    dispatch({ type: 'SEND_FEEDBACK_FAIL', payload: error.response?.data || error.message });
  }
};
export const fetchPerformanceReports = () => async (dispatch, getState) => {
  try {
    dispatch({ type: 'FETCH_PERFORMANCE_REPORTS_REQUEST' });

    const { user } = getState().auth;
    const student_id = user.user_id;

    const res = await axios.get(`/api/students/${student_id}/performance`);

    // Ensure the response has the expected structure
    if (res.data && Array.isArray(res.data.performance_reports)) {
      console.log(res.data.performance_reports)
      dispatch({
        type: 'FETCH_PERFORMANCE_REPORTS_SUCCESS',
        payload: res.data.performance_reports,
      });
    } else {
      dispatch({
        type: 'FETCH_PERFORMANCE_REPORTS_FAIL',
        payload: 'Invalid response structure from server.',
      });
    }
  } catch (error) {
    dispatch({
      type: 'FETCH_PERFORMANCE_REPORTS_FAIL',
      payload:
        error.response?.data?.message ||
        error.message ||
        'An error occurred while fetching performance reports.',
    });
  }
};