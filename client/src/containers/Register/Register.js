import React, { useState,Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { register } from '../../actions/auth';
const Register = ({ register, history }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const { name, email, password, password2 } = formData;
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
    return (
      <Fragment>
        <section className='container'>
          <h1 className='large text-primary'>Sign Up</h1>
          <p className='lead'>
            <i className='fas fa-user' /> Create Your Account
          </p>
          <form
            onSubmit={e => {
              e.preventDefault();

              register(name, email, password, password2, history);
            }}
            className='form'>
            <div className='form-group'>
              <input
                onChange={e => onChange(e)}
                type='text'
                placeholder='Name'
                name='name'
                value={name}
                required
              />
            </div>
            <div className='form-group'>
              <input
                onChange={e => onChange(e)}
                type='email'
                placeholder='Email Address'
                name='email'
                value={email}
              />
            </div>
            <div className='form-group'>
              <input
                onChange={e => onChange(e)}
                type='password'
                placeholder='Password'
                name='password'
                value={password}
                minLength={3}
              />
            </div>
            <div className='form-group'>
              <input
                onChange={e => onChange(e)}
                type='password'
                placeholder='Confirm Password'
                name='password2'
                value={password2}
                minLength={3}
              />
            </div>
            <input
              type='submit'
              className='btn btn-primary'
              defaultValue='Register'
            />
          </form>
          <p className='my-1'>
            Already have an account? <Link to='/login'>Sign In</Link>
          </p>
        </section>
      </Fragment>
    );
  
};
export default connect(
  null,
  { register }
)(Register);
