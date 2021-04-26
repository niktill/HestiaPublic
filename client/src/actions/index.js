import axios from 'axios';
import {
  FETCH_USER,
  FETCH_ATHLETES,
  ADD_ATHLETE,
  DELETE_ATHLETE,
  CHANGE_USER_EMAIL,
  CHANGE_USER_EMAIL_NOTIFICATIONS,
  FETCH_ATHLETE,
  UPLOAD_IMU,
} from './types';

// action to get current user, is false if no user is logged in
export const fetchUser = () => async (dispatch) => {
  try {
    const res = await axios.get('/auth/users/me');
    dispatch({ type: FETCH_USER, payload: res.data });
  } catch (error) {
    console.log(error);
  }
};

// action to change email address for user
export const changeUserEmail = (email) => async (dispatch) => {
  try {
    const res = await axios.patch('/auth/users/me/email', { email });
    dispatch({ type: CHANGE_USER_EMAIL, payload: res.data });
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

// action to turn on or off user email notifications
export const changeUserEmailNotifications = (toggle) => async (dispatch) => {
  try {
    const res = await axios.patch('/auth/users/me/email/notifications', {
      toggle,
    });
    dispatch({ type: CHANGE_USER_EMAIL_NOTIFICATIONS, payload: res.data });
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

// action to fetch user's athletes for athletes page
export const fetchAthletes = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/athletes');
    dispatch({ type: FETCH_ATHLETES, payload: res.data });
  } catch (error) {
    console.log(error);
  }
};

// action to add athlete
export const addAthlete = (newAthleteName) => async (dispatch) => {
  try {
    const res = await axios.post('/api/athletes', { name: newAthleteName });
    dispatch({ type: ADD_ATHLETE, payload: res.data });
  } catch (error) {
    console.log(error);
  }
};

// action to delete athlete
export const deleteAthlete = (athleteId) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/athletes/${athleteId}`);
    dispatch({ type: DELETE_ATHLETE, payload: res.data });
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

// action to fetch single athlete data
export const fetchAthlete = (athleteId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/athletes/${athleteId}`);
    dispatch({ type: FETCH_ATHLETE, payload: res.data });
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

// action to upload imu data for athlete
export const uploadIMU = (athleteId, file) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append('upload', file);
    const res = await axios.post(`/api/athletes/${athleteId}/imu`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch({ type: UPLOAD_IMU, payload: res.data });
    return Promise.resolve(res);
  } catch (error) {
    if (error.isAxiosError) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
};
