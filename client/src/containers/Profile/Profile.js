import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchProfile } from '../../actions/profile';
import Moment from 'react-moment';
const Profile = ({ fetchProfile, profile, loading, match, auth }) => {
  useEffect(() => {
    fetchProfile(match.params.id);
  }, [fetchProfile, match.params.id]);

  return (
    <Fragment>
      {profile === null || loading ? (
        <h1>Loading</h1>
      ) : (
        <Fragment>
          <Link to='/profiles' className='btn btn-light'>
            Back to Profiles
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Link to='/edit-profile' className='btn btn-dark'>
                Edit profile
              </Link>
            )}
          <div className='profile-grid my-1'>
            <Fragment>
              <div className='profile-top bg-primary p-2'>
                <img className='round-img my-1' alt='' src={profile.avatar} />
                <h1 className='large'>{profile.user.name}</h1>
                <p className='lead'>
                  {profile.status}{' '}
                  {profile.company && <span> at {profile.company}</span>}
                </p>
                <p>{profile.location && <span>{profile.location}</span>} </p>
                <div className='icons my-1'>
                  {profile.website && (
                    <a
                      href={profile.website}
                      target='_blank'
                      rel='noopener noreferrer'>
                      <i className='fas fa-globe fa-2x' />
                    </a>
                  )}
                  {profile.social && profile.social.twitter && (
                    <a
                      href={profile.social.twitter}
                      target='_blank'
                      rel='noopener noreferrer'>
                      <i className='fab fa-twitter fa-2x' />
                    </a>
                  )}
                  {profile.social && profile.social.facebook && (
                    <a
                      href={profile.social.facebook}
                      target='_blank'
                      rel='noopener noreferrer'>
                      <i className='fab fa-facebook fa-2x' />
                    </a>
                  )}
                  {profile.social && profile.social.linkedin && (
                    <a
                      href={profile.social.linkedin}
                      target='_blank'
                      rel='noopener noreferrer'>
                      <i className='fab fa-aedin fa-2x' />
                    </a>
                  )}
                  {profile.social && profile.social.youtube && (
                    <a
                      href={profile.social.youtube}
                      target='_blank'
                      rel='noopener noreferrer'>
                      <i className='fab fa-youtube fa-2x' />
                    </a>
                  )}
                  {profile.social && profile.social.instagram && (
                    <a
                      href={profile.social.instagram}
                      target='_blank'
                      rel='noopener noreferrer'>
                      <i className='fab fa-instagram fa-2x' />
                    </a>
                  )}
                </div>
              </div>
            </Fragment>

            <div className='profile-about bg-light p-2'>
              {profile.bio && (
                <Fragment>
                  <h2 className='text-primary'>
                    {profile.user.name.trim().split(' ')[0]}'s Bio
                  </h2>
                  <p>{profile.bio}</p>
                  <div className='line' />
                </Fragment>
              )}
              <h2 className='text-primary'>Skill Set</h2>
              <div className='skills'>
                {profile.skills.map((skill, index) => (
                  <div key={index} className='p-1'>
                    <i className='fas fa-check'>{skill}</i>
                  </div>
                ))}
              </div>
            </div>
            <div className='profile-exp bg-white p-2'>
              <h2 className='text-primary'>Experience</h2>
              {profile.experience.length > 0 ? (
                <Fragment>
                  {profile.experience.map(experience => (
                    <div>
                      <h3 className='text-dark'>{experience.company}</h3>
                      <p>
                        <Moment format='DD/MM/YYYY'>{experience.from}</Moment> -{' '}
                        {!experience.to ? (
                          'Present'
                        ) : (
                          <Moment format='DD/MM/YYYY'>{experience.to}</Moment>
                        )}
                      </p>
                      <p>
                        <strong>Position: </strong>
                        {experience.title}
                      </p>
                      <p>
                        {experience.description && (
                          <span>
                            <strong>Description: </strong>
                            {experience.description}
                          </span>
                        )}
                      </p>
                      <p> </p>
                    </div>
                  ))}
                </Fragment>
              ) : (
                <h4>No experience credentials</h4>
              )}
            </div>
            <div className='profile-edu bg-white p-2'>
              <h2 className='text-primary'>Education</h2>
              {profile.education.length > 0 ? (
                <Fragment>
                  {profile.education.map(edu => (
                    <div>
                      <h3 className='text-dark'>{edu.school}</h3>
                      <p>
                        <Moment format='DD/MM/YYYY'>{edu.from}</Moment> -{' '}
                        {!edu.to ? (
                          'Present'
                        ) : (
                          <Moment format='DD/MM/YYYY'>{edu.to}</Moment>
                        )}
                      </p>
                      <p>
                        <strong>Degree: </strong>
                        {edu.degree}
                      </p>
                      <p>
                        <strong>Field of Study: </strong>
                        {edu.fieldofstudy}
                      </p>
                      <p>
                        {edu.description && (
                          <span>
                            <strong>Description: </strong>
                            {edu.description}
                          </span>
                        )}
                      </p>
                    </div>
                  ))}
                </Fragment>
              ) : (
                <h4>No education credentials</h4>
              )}
            </div>
            {/* {profile.githubusername && (
              <div className='profile-github'>
                <h2 className='text-primary my-1'>Github Repos</h2>
                {repos === null ? (
                  <Spinner />
                ) : (
                  repos.map(repo => (
                    <div key={repo._id} className='repo bg-white p-1 my-1'>
                      <div>
                        <h4>
                          <a
                            href={repo.html_url}
                            target='_blank'
                            rel='noopener noreferrer'>
                            {repo.name}
                          </a>
                        </h4>
                        <p>{repo.description}</p>
                      </div>
                      <div>
                        <ul>
                          <li className='badge badge-primary'>
                            Stars: {repo.stargazers_count}
                          </li>
                          <li className='badge badge-dark'>
                            Watchers: {repo.watchers_count}
                          </li>
                          <li className='badge badge-light'>
                            Forks: {repo.forks_count}
                          </li>
                        </ul>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )} */}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

const mapStateToProps = state => ({
  profile: state.profile.profile,
  loading: state.profile.loading,
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { fetchProfile }
)(Profile);
