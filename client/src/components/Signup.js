import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Button,
  Header,
  Form,
  Segment,
  Image,
  Container,
} from 'semantic-ui-react';
import axios from 'axios';
import MessageBlock from './MessageBlock';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newEmail: '',
      newPassword: '',
      confirmPassword: '',
      errorMessage: '',
    };
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSignupSubmit = async () => {
    const { newEmail, newPassword, confirmPassword } = this.state;
    if (newPassword !== confirmPassword) {
      return this.setState({
        errorMessage: 'Passwords do not match',
      });
    }
    try {
      const bodyData = { email: newEmail, password: newPassword };
      const res = await axios.post('/auth/users', bodyData);
      if (res.status === 200) {
        // signup successful
        document.location.href = '/';
      }
    } catch (error) {
      // login failed
      if (error.response.status === 400) {
        this.setState({
          errorMessage: error.response.data.message,
        });
      }
    }
    return false;
  };

  render() {
    return (
      <Container style={{ paddingTop: '15px', paddingBottom: '15px' }}>
        <Image src='/images/logo.png' id='login-logo' centered />
        <Segment id='login-form' raised>
          <Header as='h3' textAlign='center' style={{ color: '#467791' }}>
            Sign up
          </Header>
          <Form onSubmit={() => this.handleSignupSubmit()}>
            <Form.Field>
              <label htmlFor='new-email'>Email</label>
              <Form.Input
                onChange={this.handleChange}
                autoComplete='email'
                placeholder='Email'
                required
                name='newEmail'
                id='new-email'
                type='email'
              />
            </Form.Field>
            <Form.Field>
              <label htmlFor='new-password'>Password</label>
              <Form.Input
                onChange={this.handleChange}
                autoComplete='new-password'
                placeholder='Password'
                required
                name='newPassword'
                id='new-password'
                type='password'
              />
            </Form.Field>
            <Form.Field>
              <label htmlFor='confirm-password'>Confirm Password</label>
              <Form.Input
                onChange={this.handleChange}
                autoComplete='new-password'
                placeholder='Confirm Password'
                required
                name='confirmPassword'
                id='confirm-password'
                type='password'
              />
            </Form.Field>
            <Button primary type='submit' aria-label='sign up'>
              Sign Up
            </Button>
          </Form>
          {this.state.errorMessage ? (
            <MessageBlock
              clearMessage={() => {
                this.setState({ errorMessage: '' });
              }}
              error
              message={this.state.errorMessage}
              style={{ marginTop: '10px' }}
            />
          ) : null}
          <Container textAlign='center' style={{ marginTop: '15px' }}>
            <Link to='/login' style={{ textAlign: 'center' }}>
              Already have an account? Log in!
            </Link>
          </Container>
        </Segment>
      </Container>
    );
  }
}

export default connect()(Signup);
