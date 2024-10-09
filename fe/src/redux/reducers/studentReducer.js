// src/redux/reducers/studentReducer.js
export const FETCH_RECOMMENDED_CLASSES_REQUEST = 'FETCH_RECOMMENDED_CLASSES_REQUEST';
export const FETCH_RECOMMENDED_CLASSES_SUCCESS = 'FETCH_RECOMMENDED_CLASSES_SUCCESS';
export const FETCH_RECOMMENDED_CLASSES_FAILURE = 'FETCH_RECOMMENDED_CLASSES_FAILURE';

const initialState = {
  classes: [],
  availableClasses: [],
  tests: [],
  currentTest: null,
  performanceReports: [],
  feedback: [],
  recommendedClasses: [],
  loadingClasses: false,
  loadingRecommended: false,
  errorClasses: null,
  errorRecommended: null,
};

const studentReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_ENROLLED_CLASSES_SUCCESS':
      console.log("IN State Dispatch",action.payload)
      return { ...state, classes: action.payload, error: null };
    case 'FETCH_ENROLLED_CLASSES_FAIL':
      console.log("IN State Dispatch",action.payload)
      return { ...state, error: action.payload };
    case 'FETCH_AVAILABLE_CLASSES_SUCCESS':
      return { ...state, availableClasses: action.payload, error: null };
    case 'FETCH_AVAILABLE_CLASSES_FAIL':
      return { ...state, error: action.payload };
    case 'ENROLL_IN_CLASS_SUCCESS':
      return { ...state, error: null };
    case 'ENROLL_IN_CLASS_FAIL':
      return { ...state, error: action.payload };
    case 'FETCH_TESTS_SUCCESS':
      return { ...state, tests: action.payload, error: null };
    case 'FETCH_TESTS_FAIL':
      return { ...state, error: action.payload };
    case 'FETCH_TEST_DETAILS_SUCCESS':
      return { ...state, currentTest: action.payload, error: null };
    case 'FETCH_TEST_DETAILS_FAIL':
      return { ...state, error: action.payload };
    case 'SUBMIT_TEST_SUCCESS':
      return {
        ...state,
        performanceReports: [...state.performanceReports, action.payload],
        error: null,
      };
    case 'SUBMIT_TEST_FAIL':
      return { ...state, error: action.payload };
    case 'FETCH_PERFORMANCE_REPORTS_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_PERFORMANCE_REPORTS_SUCCESS':
      return { ...state, loading: true, performanceReports: action.payload, error: null };
    case 'FETCH_PERFORMANCE_REPORTS_FAIL':
      return { ...state, error: action.payload };
    case 'FETCH_FEEDBACK_SUCCESS':
      return { ...state, feedback: action.payload, error: null };
    case 'FETCH_FEEDBACK_FAIL':
      return { ...state, error: action.payload };
    case 'SEND_FEEDBACK_SUCCESS':
      return { ...state, error: null };
    case 'SEND_FEEDBACK_FAIL':
      return { ...state, error: action.payload };
    case 'FETCH_TESTS_REQUEST':
      return { ...state, loading: true, error: null };
    case FETCH_RECOMMENDED_CLASSES_REQUEST:
      return { ...state, loadingRecommended: true, errorRecommended: null };

    case FETCH_RECOMMENDED_CLASSES_SUCCESS:
      return {
        ...state,
        loadingRecommended: false,
        recommendedClasses: action.payload,
      };

    case FETCH_RECOMMENDED_CLASSES_FAILURE:
      return {
        ...state,
        loadingRecommended: false,
        errorRecommended: action.payload,
      };
    default:
      return state;

  }
};

export default studentReducer;
