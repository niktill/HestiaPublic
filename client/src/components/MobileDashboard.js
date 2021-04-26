import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Sidebar, Menu, Icon, Segment, Image } from 'semantic-ui-react';
import { Switch, Route, Link, Redirect, withRouter } from 'react-router-dom';
import Athletes from './Athletes';
import Settings from './Settings';
import AthletePage from './AthletePage';

class MobileDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
    this.onLogout = this.props.onLogout;
  }

  render() {
    return (
      <div id='mobile-dashboard'>
        <Sidebar.Pushable as={Segment} style={{ marginTop: '0' }}>
          <Sidebar
            as={Menu}
            animation='overlay'
            icon='labeled'
            onHide={() => this.setState({ visible: false })}
            vertical
            visible={this.state.visible}
            width='thin'
          >
            <Link to='/athletes' className='mobile-nav-link'>
              <Menu.Item
                as='div'
                disabled={this.props.location.pathname === '/athletes'}
                onClick={() => this.setState({ visible: false })}
              >
                <Icon name='users' size='large' />
                Athletes
              </Menu.Item>
            </Link>
            <Link to='/settings' className='mobile-nav-link'>
              <Menu.Item
                as='div'
                disabled={this.props.location.pathname === '/settings'}
                onClick={() => this.setState({ visible: false })}
              >
                <Icon name='setting' size='large' />
                Settings
              </Menu.Item>
            </Link>
            <Link to='/auth/logout' className='mobile-nav-link'>
              <Menu.Item as='div' onClick={() => this.onLogout()}>
                <Icon name='sign-out' size='large' />
                Logout
              </Menu.Item>
            </Link>
          </Sidebar>
          <Sidebar.Pusher dimmed={this.state.visible}>
            <Menu
              style={{
                marginBottom: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '50px',
                padding: '5px 15px',
              }}
              id='mobile-menu'
            >
              <Icon
                aria-label='Open navigation Menu'
                role='button'
                size='large'
                name='bars'
                onClick={() => this.setState({ visible: true })}
              />
              <Image src='/images/logo-side-text.png' id='mobile-nav-logo' />
            </Menu>
            <div style={{ paddingTop: '20px' }}>
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
            </div>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

const MobileDashboardWithRouter = withRouter(MobileDashboard);

function mapStateToProps({ browser }) {
  return { browser };
}

export default connect(mapStateToProps)(MobileDashboardWithRouter);
