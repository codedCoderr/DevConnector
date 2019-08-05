import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  LOGIN_FAIL,
  LOGIN_SUCCESS
} from '../actions/types';

const initialState = {
  isAuthenticated: null,
  token: localStorage.getItem('token'),
  error: null
};
export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload);
      return {
        ...state,
        isAuthenticated: true,
        token:payload
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        error: payload
      };
    default:
      return state;
  }
}
