import React, { Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';
const Navbar = ({ logout, isAuthenticated }) => {
  return (
    <nav className='navbar bg-dark'>
      <h1>
        {isAuthenticated ? (
          <Link to='/dashboard'>
            <i className='fas fa-code' /> DevConnector
          </Link>
        ) : (
          <Link to='/'>
            <i className='fas fa-code' /> DevConnector
          </Link>
        )}
      </h1>

      <ul>
        <li>
          <Link to='/profiles'>Developers</Link>
        </li>
        {isAuthenticated ? (
          <Fragment>
            <li>
              <Link to='/dashboard'>Dashboard</Link>
            </li>
            <li onClick={() => logout()}>
              <Link to='/login'>Logout</Link>
            </li>
          </Fragment>
        ) : (
          <Fragment>
            <li>
              <Link to='/register'>Register</Link>
            </li>
            <li>
              <Link to='/login'>Login</Link>
            </li>
          </Fragment>
        )}
      </ul>
    </nav>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});
export default connect(
  mapStateToProps,
  { logout }
)(Navbar);
