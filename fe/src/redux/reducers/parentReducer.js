// src/redux/reducers/parentReducer.js
const initialState = {
  children: [],
  childPerformance: [],
  feedback: [],
  error: null,
};

const parentReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_CHILDREN_SUCCESS':
      console.log(action.payload)
      return { ...state, children: action.payload, error: null };
    case 'FETCH_CHILDREN_FAIL':
      return { ...state, error: action.payload };
    case 'FETCH_CHILD_PERFORMANCE_SUCCESS':
      return { ...state, childPerformance: action.payload, error: null };
    case 'FETCH_CHILD_PERFORMANCE_FAIL':
      return { ...state, error: action.payload };
    case 'FETCH_FEEDBACK_SUCCESS':
      return { ...state, feedback: action.payload, error: null };
    case 'FETCH_FEEDBACK_FAIL':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default parentReducer;
