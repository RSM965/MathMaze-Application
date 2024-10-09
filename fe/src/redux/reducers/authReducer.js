// src/redux/reducers/authReducer.js
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'LOGIN_FAIL':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        error: null,
      };
    case 'REGISTER_FAIL':
      return {
        ...state,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };
    default:
      return state;
  }
};

export default authReducer;
