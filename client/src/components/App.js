import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import AppLoader from './AppLoader';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import * as actions from '../actions';

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <div id='app'>
        {this.props.auth === null ? (
          <AppLoader message='Loading App' image />
        ) : (
          <BrowserRouter>
            <Switch>
              <Route exact path='/login'>
                {this.props.auth ? <Redirect to='/' /> : <Login />}
              </Route>
              <Route exact path='/signup'>
                {this.props.auth ? <Redirect to='/' /> : <Signup />}
              </Route>
              <Route path='/'>
                {!this.props.auth ? <Redirect to='/login' /> : <Dashboard />}
              </Route>
            </Switch>
          </BrowserRouter>
        )}
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(App);
