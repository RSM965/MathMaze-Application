// src/redux/actions/parentActions.js
import axios from '../../utils/axiosConfig';

export const fetchChildren = () => async (dispatch, getState) => {
  try {
    const { user } = getState().auth;
    const parent_id = user.user_id;
    const res = await axios.get(`/api/parents/${parent_id}/students`);
    console.log('From action',res.data)
    dispatch({ type: 'FETCH_CHILDREN_SUCCESS', payload: res.data });
  } catch (error) {
    dispatch({ type: 'FETCH_CHILDREN_FAIL', payload: error.response?.data || error.message });
  }
};

export const fetchChildPerformance = (student_id) => async (dispatch, getState) => {
  try {
    const { user } = getState().auth;
    const parent_id = user.user_id;
    const res = await axios.get(
      `/api/parents/${parent_id}/students/${student_id}/performance`
    );
    dispatch({ type: 'FETCH_CHILD_PERFORMANCE_SUCCESS', payload: res.data.performance_reports });
  } catch (error) {
    dispatch({ type: 'FETCH_CHILD_PERFORMANCE_FAIL', payload: error.response?.data || error.message });
  }
};

export const downloadReportCard = (student_id) => async (dispatch, getState) => {
  try {
    const { user } = getState().auth;
    const parent_id = user.user_id;
    const res = await axios.get(
      `/api/parents/${parent_id}/students/${student_id}/report-card`,
      {
        responseType: 'application/pdf',
      }
    );
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report_card_${student_id}.pdf`);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error('Error downloading report card:', error);
  }
};

export const fetchFeedback = () => async (dispatch, getState) => {
  try {
    const { user } = getState().auth;
    const parent_id = user.user_id;
    const res = await axios.get(`/api/parents/${parent_id}/feedback`);
    dispatch({ type: 'FETCH_FEEDBACK_SUCCESS', payload: res.data.feedback_messages });
  } catch (error) {
    dispatch({ type: 'FETCH_FEEDBACK_FAIL', payload: error.response?.data || error.message });
  }
};
