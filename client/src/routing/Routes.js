import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from '../containers/Register/Register';
import Login from '../containers/Login/Login';
import Alert from '../components/layout/Alert';
const Routes = () => {
  return (
    <section className='container'>
      <Alert />
      <Switch>
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
      </Switch>
    </section>
  );
};

export default Routes;
