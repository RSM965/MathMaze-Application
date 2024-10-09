// src/redux/store.js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import authReducer from './reducers/authReducer';
import teacherReducer from './reducers/teacherReducer';
import studentReducer from './reducers/studentReducer';
import parentReducer from './reducers/parentReducer';
import miscReducer from './reducers/miscReducers'; 
const rootReducer = combineReducers({
  auth: authReducer,
  teacher: teacherReducer,
  student: studentReducer,
  parent: parentReducer,
  misc:miscReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
