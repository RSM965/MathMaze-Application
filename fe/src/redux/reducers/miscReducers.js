// src/redux/reducers/miscReducer.js

const initialState = {
    availableClasses: [],
    classCategories: [],
    allCategories: [],  // New state for storing all categories
    loading: false,
    error: null,
  };
  
  const miscReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_AVAILABLE_CLASSES_SUCCESS':
        return {
          ...state,
          availableClasses: action.payload,
          loading: false,
          error: null,
        };
  
      case 'FETCH_AVAILABLE_CLASSES_FAIL':
        return {
          ...state,
          availableClasses: [],
          loading: false,
          error: action.payload,
        };
  
      case 'FETCH_CLASS_CATEGORIES_SUCCESS':
        return {
          ...state,
          classCategories: action.payload,
          loading: false,
          error: null,
        };
  
      case 'FETCH_CLASS_CATEGORIES_FAIL':
        return {
          ...state,
          classCategories: [],
          loading: false,
          error: action.payload,
        };
  
      // New cases for fetching all categories
      case 'FETCH_ALL_CATEGORIES_SUCCESS':
        return {
          ...state,
          allCategories: action.payload,
          loading: false,
          error: null,
        };
  
      case 'FETCH_ALL_CATEGORIES_FAIL':
        return {
          ...state,
          allCategories: [],
          loading: false,
          error: action.payload,
        };
  
      case 'FETCH_CLASSES_REQUEST':
      case 'FETCH_CATEGORIES_REQUEST':
        return {
          ...state,
          loading: true,
          error: null,
        };
  
      default:
        return state;
    }
  };
  
  export default miscReducer;
  