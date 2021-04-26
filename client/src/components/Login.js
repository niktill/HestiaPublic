import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Header, Form, Segment, Image, Container } from 'semantic-ui-react';
import MessageBlock from './MessageBlock';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: '',
    };
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleLoginSubmit = async () => {
    const { email, password } = this.state;
    try {
      const res = await axios.post('/auth/login', { email, password });
      if (res.status === 200) {
        // login successful
        document.location.href = '/';
      }
    } catch (error) {
      // login failed
      if (error.response.status === 401) {
        this.setState({
          errorMessage: error.response.data.message,
        });
      }
    }
  };

  render() {
    return (
      <Container style={{ paddingTop: '15px', paddingBottom: '15px' }}>
        <Image src='/images/logo.png' id='login-logo' centered />
        <Segment id='login-form' raised>
          <Header as='h3' textAlign='center' style={{ color: '#467791' }}>
            Login
          </Header>
          <Form onSubmit={() => this.handleLoginSubmit()}>
            <Form.Field>
              <label htmlFor='email'>Email</label>
              <Form.Input
                onChange={this.handleChange}
                autoComplete='email'
                placeholder='Email'
                required
                name='email'
                id='email'
                type='email'
                value={this.state.email}
              />
            </Form.Field>
            <Form.Field>
              <label htmlFor='password'>Password</label>
              <Form.Input
                onChange={this.handleChange}
                placeholder='Password'
                autoComplete='current-password'
                required
                name='password'
                id='password'
                type='password'
                value={this.state.password}
              />
            </Form.Field>
            <Form.Button primary type='submit' aria-label='log in'>
              Log In
            </Form.Button>
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
            <Link to='/signup' style={{ textAlign: 'center' }}>
              Don&apos;t have an account? Sign up!
            </Link>
          </Container>
        </Segment>
      </Container>
    );
  }
}

export default connect()(Login);
