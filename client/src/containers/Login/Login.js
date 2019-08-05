import React,{useState} from 'react'
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {login} from '../../actions/auth'
const Login = ({login,history}) => {
  const [formData,setFormData]=useState({
    email:'',
    password:''
  })
  const{email,password}=formData;
  const onChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }
  return (
    <div>
      <section className='container'>
        <h1 className='large text-primary'>Sign In</h1>
        <p className='lead'>
          <i className='fas fa-user' /> Sign into Your Account
        </p>
        <form
          onSubmit={e => {
            e.preventDefault();
            login(email, password, history);
          }}>
          <div className='form-group'>
            <input
              onChange={e => onChange(e)}
              value={email}
              type='email'
              placeholder='Email Address'
              name='email'
              required
            />
          </div>
          <div className='form-group'>
            <input
              onChange={e => onChange(e)}
              value={password}
              type='password'
              placeholder='Password'
              name='password'
            />
          </div>
          <input
            type='submit'
            className='btn btn-primary'
            defaultValue='Login'
          />
        </form>
        <p className='my-1'>
          Don't have an account? <Link to='/register'>Sign Up</Link>
        </p>
      </section>
    </div>
  );
}

export default connect(null,{login}) (Login)
