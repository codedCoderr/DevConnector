import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  LOGIN_FAIL,
  LOGIN_SUCCESS
} from './types';
import axios from 'axios';

export const register = (
  name,
  email,
  password,
  password2,
  history
) => async dispatch => {
  const body = JSON.stringify({
    name,
    email,
    password,
    password2
  });
  const config = {
    headers: { 'Content-Type': 'application/json' }
  };
  try {
    const response = await axios.post('/register', body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: response.data
    });
    history.push('/profiles');
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.map(error => console.log(error.msg));
    }
    dispatch({
      type: REGISTER_FAIL,
      payload: error
    });
  }
};
export const login=(email,password,history)=>async dispatch=>{
const body = JSON.stringify({
  email,
  password 
});
const config = {
  headers: { 'Content-Type': 'application/json' }
};
try {
  const response=axios.post('/login',body,config)
  dispatch({
    type: LOGIN_SUCCESS,
    payload: response.data
  });
  history.push('/profiles');
} catch (error) {
  const errors = error.response.data.errors;
  if (errors) {
    errors.map(error => console.log(error.msg));
  }
  dispatch({
    type: LOGIN_FAIL,
    payload: error
  });
}
}
