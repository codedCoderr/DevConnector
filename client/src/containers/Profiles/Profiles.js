import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchProfiles } from '../../actions/profile';

const Profiles = ({ fetchProfiles, profiles, loading }) => {
  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);
  return (
    <Fragment>
      {loading ? (
        <h1>Loading</h1>
      ) : (
        <Fragment>
          <h1 className='large text-primary'>Developers</h1>
          <p className='lead'>
            <i className='fab fa-connectdevelop'>
              Browse and connect with developers
            </i>
          </p>
          <div className='profiles'>
            {profiles.length > 0 ? (
              profiles.map(profile => (
                <div key={profile.user._id} className='profile bg-light'>
                  <img src={profile.avatar} alt='' className='round-img' />
                  <div>
                    <h2>{profile.user.name}</h2>
                    <p>
                      {profile.status}{' '}
                      {profile.company && <span> at {profile.company}</span>}{' '}
                    </p>
                    <p className='my-1'>
                      {profile.location && <span>{profile.location}</span>}
                    </p>
                    <Link
                      to={`/profile/${profile.user._id}`}
                      className='btn btn-primary'>
                      {' '}
                      View Profile
                    </Link>
                  </div>

                  <ul>
                    {profile.skills.slice(0, 5).map((skill, index) => (
                      <li key={index} className='text-primary'>
                        <i className='fas fa-check'> {skill}</i>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <h4>No profiles found</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

const mapStateToProps = state => ({
  // profile:state.profile.profile,
  profiles: state.profile.profiles,
  loading: state.profile.loading
});
export default connect(
  mapStateToProps,
  { fetchProfiles }
)(Profiles);
