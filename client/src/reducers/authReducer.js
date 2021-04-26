import {
  FETCH_USER,
  CHANGE_USER_EMAIL,
  CHANGE_USER_EMAIL_NOTIFICATIONS,
} from '../actions/types';

export default function authReducer(state = null, action) {
  switch (action.type) {
    case FETCH_USER:
      return action.payload || false;
    case CHANGE_USER_EMAIL:
      return { ...state, email: action.payload.email };
    case CHANGE_USER_EMAIL_NOTIFICATIONS:
      return {
        ...state,
        emailNotifications: action.payload.emailNotifications,
      };
    default:
      return state;
  }
}
