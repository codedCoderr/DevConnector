import React, { useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
  getCurrentProfile,
  deleteEducation,
  deleteExperience,
  deleteAccount
} from '../../actions/profile';
import { loadUser } from '../../actions/auth';
import { connect } from 'react-redux';
import Moment from 'react-moment';

const Dashboard = ({
  getCurrentProfile,
  deleteEducation,
  deleteAccount,
  deleteExperience,
  profile,
  loading,
  user,
  history
}) => {
  useEffect(() => {
    getCurrentProfile();
    loadUser();
  }, [getCurrentProfile]);

  return loading && profile === null ? (
    <h1>Loading</h1>
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment>
          <div className='dash-buttons'>
            <Link to='/edit-profile' className='btn btn-light'>
              <i className='fas fa-user-circle text-primary' /> Edit Profile
            </Link>
            <Link to='/add-experience' className='btn btn-light'>
              <i className='fab fa-black-tie text-primary' /> Add Experience
            </Link>
            <Link to='/add-education' className='btn btn-light'>
              <i className='fas fa-graduation-cap text-primary' /> Add Education
            </Link>
          </div>
          <Fragment>
            <h2 className='my-2'>Education Credentials</h2>

            <table className='table'>
              <thead>
                <tr>
                  <th>School</th>
                  <th className='hide-sm'>Degree</th>
                  <th className='hide-sm'>Years</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {profile.education.map(edu => (
                  <tr key={edu._id}>
                    <td>{edu.school}</td>
                    <td className='hide-sm'>{edu.degree}</td>
                    <td>
                      <Moment format='DD/MM/YYYY'>{edu.from}</Moment> -{' '}
                      {edu.to === null ? (
                        ' Present'
                      ) : (
                        <Moment format='DD/MM/YYYY'>{edu.to}</Moment>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          deleteEducation(edu._id);
                        }}
                        className='btn btn-danger'>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Fragment>
          <Fragment>
            <h2 className='my-2'>Experience Credentials</h2>

            <table className='table'>
              <thead>
                <tr>
                  <th>Company</th>
                  <th className='hide-sm'>Title</th>
                  <th className='hide-sm'>Years</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {profile.experience.map(exp => (
                  <tr key={exp._id}>
                    <td>{exp.company}</td>
                    <td className='hide-sm'>{exp.title}</td>
                    <td>
                      <Moment format='DD/MM/YYYY'>{exp.from}</Moment> -{' '}
                      {exp.to === null ? (
                        ' Present'
                      ) : (
                        <Moment format='DD/MM/YYYY'>{exp.to}</Moment>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          deleteExperience(exp._id);
                        }}
                        className='btn btn-danger'>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Fragment>

          <div className='my-2'>
            <button
              className='btn btn-danger'
              onClick={() =>
                deleteAccount(history)  
              }>
              <i className='fas fa-user-minus' /> Delete My Account
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not yet set up a profile,please add some info</p>
          <Link to='/create-profile' className='btn btn-primary my-1'>
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

const mapStateToProps = state => ({
  profile: state.profile.profile,
  loading: state.profile.loading,
  user: state.auth.user
});
export default connect(
  mapStateToProps,
  {
    getCurrentProfile,
    deleteAccount,
    deleteEducation,
    deleteExperience,
    loadUser
  }
)(Dashboard);
