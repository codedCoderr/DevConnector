import {
  FETCH_PROFILES_SUCCESS,
  FETCH_PROFILES_FAIL,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAIL
} from '../actions/types';

const initialState={
  profile:{},
  profiles:[],
  loading:true
}
export default function(state=initialState,action){
const{type,payload}=action;
switch(type){
  case FETCH_PROFILES_SUCCESS:
  return {
    ...state,
    profiles: payload,
    loading: false
  };
  case FETCH_PROFILES_FAIL:
  return {
    ...state,
    profiles: payload,
    loading: false
  };
  case FETCH_PROFILE_SUCCESS:
  return {
    ...state,
    profile: payload,
    loading: false
  };
  case FETCH_PROFILE_FAIL:
  return {
    ...state,
    profile: payload,
    loading: false
  };
  default:
  return state
}
}