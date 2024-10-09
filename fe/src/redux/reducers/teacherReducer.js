// src/redux/reducers/teacherReducer.js
const initialState = {
  classes: [],
  tests: [],
  feedback: [],
  students:[],
  error: null,
};

const teacherReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_CLASSES_SUCCESS':
      return { ...state, classes: action.payload, error: null };
    case 'FETCH_CLASSES_FAIL':
      return { ...state, error: action.payload };
    case 'CREATE_CLASS_SUCCESS':
      return { ...state, classes: [...state.classes, action.payload], error: null };
    case 'CREATE_CLASS_FAIL':
      return { ...state, error: action.payload };
    case 'UPDATE_CLASS_SUCCESS':
      return {
        ...state,
        classes: state.classes.map((cls) =>
          cls.class_id === action.payload.class_id ? action.payload : cls
        ),
        error: null,
      };
    case 'UPDATE_CLASS_FAIL':
      return { ...state, error: action.payload };
    case 'DELETE_CLASS_SUCCESS':
      return {
        ...state,
        classes: state.classes.filter((cls) => cls.class_id !== action.payload),
        error: null,
      };
    case 'DELETE_CLASS_FAIL':
      return { ...state, error: action.payload };
    case 'FETCH_TESTS_SUCCESS':
      return { ...state, tests: action.payload, error: null };
    case 'FETCH_TESTS_FAIL':
      return { ...state, error: action.payload };
    case 'CREATE_TEST_SUCCESS':
      return { ...state, tests: [...state.tests, action.payload], error: null };
    case 'CREATE_TEST_FAIL':
      return { ...state, error: action.payload };
    case 'UPDATE_TEST_SUCCESS':
      return {
        ...state,
        tests: state.tests.map((test) =>
          test.test_id === action.payload.test_id ? action.payload : test
        ),
        error: null,
      };
    case 'UPDATE_TEST_FAIL':
      return { ...state, error: action.payload };
    case 'DELETE_TEST_SUCCESS':
      return {
        ...state,
        tests: state.tests.filter((test) => test.test_id !== action.payload),
        error: null,
      };
    case 'DELETE_TEST_FAIL':
      return { ...state, error: action.payload };
    case 'SEND_FEEDBACK_SUCCESS':
      return { ...state, error: null };
    case 'SEND_FEEDBACK_FAIL':
      return { ...state, error: action.payload };
    case 'FETCH_FEEDBACK_SUCCESS':
      return { ...state, feedback: action.payload, error: null };
    case 'FETCH_FEEDBACK_FAIL':
      return { ...state, error: action.payload };
    case 'FETCH_ENS_SUCCESS':
      return { ...state, students: action.payload, error: null };
    case 'FETCH_ENS_FAIL':
      return { ...state, error: action.payload };
    case 'FETCH_ENP_SUCCESS':
      return { ...state, parents: action.payload, error: null };
    case 'FETCH_ENP_FAIL':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default teacherReducer;
