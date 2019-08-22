import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from '../containers/Register/Register';
import Login from '../containers/Login/Login';
import Alert from '../components/layout/Alert';
import Profiles from '../containers/Profiles/Profiles';
import Profile from '../containers/Profile/Profile';
import CreateProfile from '../containers/Profile/CreateProfile';
import Dashboard from '../containers/DashBoard/Dashboard';
import EditProfile from '../containers/Profile/EditProfile';
import AddExperience from '../containers/Profile/AddExperience';
import AddEducation from '../containers/Profile/AddEducation';
import PrivateRoute from '../components/layout/routing/PrivateRoute';

const Routes = () => {
  return (
    <section className='container'>
      <Alert />
      <Switch>
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/profiles' component={Profiles} />
        <Route exact path='/profile/:id' component={Profile} />
        <PrivateRoute exact path='/create-profile' component={CreateProfile} />
        <PrivateRoute exact path='/edit-profile' component={EditProfile} />
        <PrivateRoute exact path='/add-experience' component={AddExperience} />
        <PrivateRoute exact path='/add-education' component={AddEducation} />
        <PrivateRoute exact path='/dashboard' component={Dashboard} />
      </Switch>
    </section>
  );
};

export default Routes;
