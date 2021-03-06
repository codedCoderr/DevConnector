import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';

const Navbar = ({ logout, isAuthenticated }) => {
  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-code' /> DevConnector
        </Link>
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
              <Link to='/login'> <span className="hide-sm">Logout</span> {' '}<i className="fas fa-sign-out-alt"> </i></Link>
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
