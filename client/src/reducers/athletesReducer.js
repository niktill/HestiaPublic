import { FETCH_ATHLETES, ADD_ATHLETE, DELETE_ATHLETE } from '../actions/types';

export default function athletesReducer(state = [], action) {
    switch (action.type) {
        case FETCH_ATHLETES:
            return action.payload;
        case ADD_ATHLETE:
            return [...state, action.payload];
        case DELETE_ATHLETE:
            return state.filter(athlete => athlete._id !== action.payload._id);
        default:
            return state;
    }
}