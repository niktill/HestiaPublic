import React from 'react';
// We're using our own custom render function and not RTL's render
// our custom utils also re-export everything from RTL
// so we can import userEvent and screen here as well
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { render, renderWithRouter, userEvent, screen } from './test-utils';
import App from '../components/App';

const mock = new MockAdapter(axios);

jest.mock('../components/Athletes', () => () => (
  <span>Mock Athletes Component</span>
));

test('Renders login email field for user not signed in', async () => {
  mock.onGet('/auth/users/me').reply(200, null);
  mock.onGet('/api/athletes').reply(200, [
    {
      name: 'Henry Jorbens',
      userObjectId: '60415d27225b24450c6cd860',
      __v: 0,
      _id: '604162f0aca6ed24cc2d49e7',
    },
  ]);
  render(<App />, { initialState: {} });
  // wait for login page to render after mock get current user call
  expect(await screen.findByLabelText(/email/i)).toBeInTheDocument();
});

test('Find confirm password field after clicking on signup link from login page', async () => {
  mock.onGet('/auth/users/me').reply(200, null);
  render(<App />, { initialState: {} });
  // wait for login page to render after mock get current user call
  await screen.findByLabelText(/email/i);
  // click signup link on login page
  userEvent.click(screen.getByText(/Sign up!/i));
  // check that confirm-password field appears
  expect(await screen.findByLabelText('Confirm Password')).toBeInTheDocument();
});

test('Renders log out text for user logged in', async () => {
  mock.onGet('/auth/users/me').reply(200, {
    email: 'testemail1@email.com',
    emailNotifications: true,
    _id: '60415d27225b24450c6cd860',
  });
  render(<App />, { initialState: {} });
  expect(await screen.findByText('Logout')).toBeInTheDocument();
});

test('Renders Settings menu when you click on Settings link', async () => {
  mock.onGet('/auth/users/me').reply(200, {
    email: 'testemail1@email.com',
    emailNotifications: true,
    _id: '60415d27225b24450c6cd860',
  });
  render(<App />, { initialState: {} });
  // Wait for mock api get current user call
  await screen.findByText('Logout');
  // Click settings tab
  userEvent.click(screen.getByText(/Settings/i));
  // Settings tab text should be rendered
  expect(screen.getAllByText('Settings').length > 1);
});

// route testing
test('Display login component on /login route when not logged in', async () => {
  mock.onGet('/auth/users/me').reply(200, null);
  renderWithRouter(<App />, {}, { route: '/login' });
  // check that mock athletes component renders\
  expect(await screen.findByText('Login')).toBeInTheDocument();
});

test('Display signup component on /signup route when not logged in', async () => {
  mock.onGet('/auth/users/me').reply(200, null);
  renderWithRouter(<App />, {}, { route: '/signup' });
  // check that mock athletes component renders\
  expect(await screen.findByText('Sign Up')).toBeInTheDocument();
});

test('Display dashboard component on /login route when logged in', async () => {
  mock.onGet('/auth/users/me').reply(200, {
    email: 'testemail1@email.com',
    emailNotifications: true,
    _id: '60415d27225b24450c6cd860',
  });
  renderWithRouter(<App />, {}, { route: '/login' });
  // check that mock athletes component renders\
  expect(await screen.findByText('Logout')).toBeInTheDocument();
});
