import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Header,
  Container,
  Segment,
  Icon,
  Button,
  Form,
  Message,
} from 'semantic-ui-react';
import Switch from 'react-switch';
import axios from 'axios';
import {
  changeUserEmail,
  changeUserEmailNotifications,
} from '../actions/index';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeEmail: this.props.auth.email,
      changeEmailMessage: { error: false, message: '' },
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      changePasswordMessage: { error: false, message: '' },
      checked: this.props.auth.emailNotifications,
    };
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleEmailNotificationToggle = async (checked) => {
    const res = await this.props.changeUserEmailNotifications(checked);
    if (res.status === 200) {
      this.setState({ checked });
    }
  };

  changeEmail = async () => {
    try {
      const res = await this.props.changeUserEmail(this.state.changeEmail);
      if (res.status === 200) {
        return this.setState({
          changeEmailMessage: {
            error: false,
            message: 'Succesfully changed email',
          },
        });
      }
      throw new Error('Error in changing email');
    } catch (error) {
      const message = error.response.data.message
        ? error.response.data.message
        : error.message;

      this.setState({
        changeEmailMessage: {
          error: true,
          message,
        },
      });
    }
    return false;
  };

  changePassword = async () => {
    try {
      if (this.state.newPassword !== this.state.confirmNewPassword) {
        return this.setState({
          changePasswordMessage: {
            error: true,
            message: 'Passwords do not match',
          },
        });
      }
      const res = await axios.patch('/auth/users/me/password', {
        email: this.props.auth.email,
        password: this.state.oldPassword,
        newPassword: this.state.newPassword,
      });
      if (res.status === 200) {
        return this.setState({
          changePasswordMessage: {
            error: false,
            message: 'Succesfully changed password',
          },
        });
      }
      throw new Error('Error in changing password');
    } catch (error) {
      const message = error.response.data.message
        ? error.response.data.message
        : error.message;

      this.setState({
        changePasswordMessage: {
          error: true,
          message,
        },
      });
    }
    return false;
  };

  render() {
    return (
      <Container>
        <Segment.Group>
          <Segment padded>
            <Header as='h2'>
              <Icon name='setting' />
              Settings
            </Header>
          </Segment>
          <Segment padded>
            <Header as='h3'>Email</Header>
            <Form
              id='change-email-form'
              onSubmit={() => {
                this.changeEmail();
              }}
            >
              <Form.Input
                label='Change Email Address'
                onChange={this.handleChange}
                placeholder='New Email Address'
                name='changeEmail'
                required
                type='email'
                id='changeEmail'
                value={this.state.changeEmail}
              />
              <Button
                primary
                content='Save'
                type='submit'
                disabled={this.state.changeEmail === this.props.auth.email}
              />
            </Form>
            <Message
              compact
              hidden={!this.state.changeEmailMessage.message}
              error={this.state.changeEmailMessage.error}
              positive={!this.state.changeEmailMessage.error}
            >
              {this.state.changeEmailMessage.message}
            </Message>
            <Container
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '30px',
              }}
            >
              <label style={{ marginRight: '10px' }}>
                <b>Email Notifications</b>
              </label>
              <Switch
                aria-label='toggle email notifications'
                onChange={this.handleEmailNotificationToggle}
                checked={this.state.checked}
              />
            </Container>
          </Segment>
          <Segment padded>
            <Header as='h3'>Change Password</Header>
            <Form
              id='change-password-form'
              onSubmit={() => {
                this.changePassword();
              }}
            >
              <Form.Input
                label='Old Password'
                onChange={this.handleChange}
                placeholder='Old Password'
                name='oldPassword'
                required
                type='password'
                id='oldPassword'
                value={this.state.oldPassword}
              />
              <Form.Input
                label='New Password'
                onChange={this.handleChange}
                placeholder='New Password'
                name='newPassword'
                required
                type='password'
                id='newPassword'
                value={this.state.newPassword}
              />
              <Form.Input
                label='Confirm New Password'
                onChange={this.handleChange}
                placeholder='Confirm New Password'
                name='confirmNewPassword'
                required
                type='password'
                id='confirmNewPassword'
                value={this.state.confirmNewPassword}
              />
              <Button primary content='Save' type='submit' />
            </Form>
            <Message
              compact
              hidden={!this.state.changePasswordMessage.message}
              error={this.state.changePasswordMessage.error}
              positive={!this.state.changePasswordMessage.error}
            >
              {this.state.changePasswordMessage.message}
            </Message>
          </Segment>
        </Segment.Group>
      </Container>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, {
  changeUserEmail,
  changeUserEmailNotifications,
})(Settings);
