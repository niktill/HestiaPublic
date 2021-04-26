import { combineReducers } from 'redux';
import { responsiveStateReducer } from 'redux-responsive';
import authReducer from './authReducer';
import athletesReducer from './athletesReducer';
import athletePageReducer from './athletePageReducer';

export default combineReducers({
  auth: authReducer,
  athletes: athletesReducer,
  athlete: athletePageReducer,
  browser: responsiveStateReducer,
});
