import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Grid, Menu, Icon } from 'semantic-ui-react';
import axios from 'axios';
import { Switch, Route, Link, Redirect, withRouter } from 'react-router-dom';
import MobileDashboard from './MobileDashboard';
import Athletes from './Athletes';
import AthletePage from './AthletePage';
import Settings from './Settings';

class Dashboard extends Component {
  onLogout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      // login failed
      console.log(error);
    }
    // try to reload to login page
    document.location.href = '/login';
    document.reload();
  };

  // Log out on hit enter key for accessibility
  keyPress = (e) => {
    if (e.keyCode === 13) {
      this.onLogout();
    }
  };

  render() {
    return !this.props.browser.lessThan.large ? (
      // desktop dashboard
      <Grid id='desktop-app-grid'>
        <Grid.Row id='desktop-app-row'>
          <Grid.Column width={3} textAlign='center' id='desktop-menu-col'>
            <Menu vertical borderless secondary id='desktop-menu'>
              <Menu.Header style={{ marginBottom: '10px' }}>
                <Image
                  src='/images/logo-side-text.png'
                  id='dashboard-logo'
                  centered
                />
              </Menu.Header>
              <Link to='/athletes'>
                <Menu.Item
                  as='div'
                  link
                  disabled={this.props.location.pathname === '/athletes'}
                >
                  <span className='nav-span'>
                    <Icon className='nav-icon' name='users' size='large' link />
                    Athletes
                  </span>
                </Menu.Item>
              </Link>
              <Link to='/settings'>
                <Menu.Item
                  as='div'
                  link
                  disabled={this.props.location.pathname === '/settings'}
                >
                  <span className='nav-span'>
                    <Icon
                      className='nav-icon'
                      name='setting'
                      size='large'
                      link
                    />
                    Settings
                  </span>
                </Menu.Item>
              </Link>
              <Menu.Item
                onClick={() => this.onLogout()}
                onKeyDown={this.keyPress}
                as='div'
                link
                tabIndex='0'
                aria-label='log out'
              >
                <span className='nav-span'>
                  <Icon
                    className='nav-icon'
                    name='sign-out'
                    size='large'
                    link
                  />
                  Logout
                </span>
              </Menu.Item>
            </Menu>
          </Grid.Column>
          <Grid.Column
            width={9}
            style={{ padding: '20px' }}
            id='desktop-dashboard-col'
          >
            <Switch>
              <Route exact path='/athletes'>
                <Athletes />
              </Route>
              <Route exact path='/athletes/:id'>
                <AthletePage />
              </Route>
              <Route exact path='/settings'>
                <Settings />
              </Route>
              <Route exact path='/'>
                <Redirect to='/athletes' />
              </Route>
              <Route>
                <Redirect to='/athletes' />
              </Route>
            </Switch>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    ) : (
      // mobile dashboard
      <MobileDashboard onLogout={this.onLogout} />
    );
  }
}

const DashboardWithRouter = withRouter(Dashboard);

function mapStateToProps({ browser }) {
  return { browser };
}

export default connect(mapStateToProps)(DashboardWithRouter);
