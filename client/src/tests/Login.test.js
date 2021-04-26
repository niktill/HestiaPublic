import React from 'react';
// We're using our own custom render function and not RTL's render
// our custom utils also re-export everything from RTL
// so we can import userEvent and screen here as well
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { renderWithRouter, userEvent, screen } from './test-utils';
import Login from '../components/Login';

const mock = new MockAdapter(axios);

test('If login fail it should show error message from api response', async () => {
  // mock response to fetch users Login
  mock.onPost('/auth/login').reply(401, { message: 'test error message' });
  renderWithRouter(<Login />, {});
  userEvent.type(screen.getByLabelText('Email'), 'testemail@email.com');
  userEvent.type(screen.getByLabelText('Password'), 'testpass');
  userEvent.click(screen.getByLabelText('log in'));

  expect(await screen.findByText('test error message')).toBeInTheDocument();
});
