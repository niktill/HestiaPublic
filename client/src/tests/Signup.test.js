import React from 'react';
// We're using our own custom render function and not RTL's render
// our custom utils also re-export everything from RTL
// so we can import userEvent and screen here as well
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { renderWithRouter, userEvent, screen } from './test-utils';
import Signup from '../components/Signup';

const mock = new MockAdapter(axios);

test('If signup fail it should show error message', async () => {
  // mock response to fetch users Signup
  mock.onPost('/auth/users').reply(400, { message: 'test error message' });
  renderWithRouter(<Signup />, {});
  userEvent.type(screen.getByLabelText('Email'), 'testemail@email.com');
  userEvent.type(screen.getByLabelText('Password'), 'testpass');
  userEvent.type(screen.getByLabelText('Confirm Password'), 'testpass');
  userEvent.click(screen.getByLabelText('sign up'));

  expect(await screen.findByText('test error message')).toBeInTheDocument();
});
