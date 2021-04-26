import { FETCH_ATHLETE, FETCH_USER, UPLOAD_IMU } from '../actions/types';

const defaultState = {
  athleteId: '',
  athleteName: '',
  userId: '',
  impactLimit: null,
  imuData: [],
};

export default function athletePageReducer(state = defaultState, action) {
  switch (action.type) {
    case FETCH_USER:
      if (!action.payload) {
        return state;
      }
      return { ...state, userId: action.payload._id };
    case FETCH_ATHLETE:
      return {
        ...state,
        athleteLoaded: true,
        athleteId: action.payload._id,
        athleteName: action.payload.name,
        impactLimit: action.payload.impactLimit,
        imuData: action.payload.imuData,
      };
    case UPLOAD_IMU:
      return {
        ...state,
        imuData: [...state.imuData, action.payload.newImuEntry],
      };
    default:
      return state;
  }
}
