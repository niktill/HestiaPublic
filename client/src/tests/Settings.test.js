import React from 'react';
// We're using our own custom render function and not RTL's render
// our custom utils also re-export everything from RTL
// so we can import userEvent and screen here as well
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { render, userEvent, screen, waitFor } from './test-utils';
import Settings from '../components/Settings';

const mock = new MockAdapter(axios);

test('Change email address form should show user email address', async () => {
  // start store with user data
  render(<Settings />, {
    initialState: {
      auth: {
        id: 'testid',
        email: 'testemail@email.com',
        emailNotifications: true,
      },
    },
  });
  expect(screen.getByLabelText('Change Email Address').value).toBe(
    'testemail@email.com'
  );
});

test('React slide for email notifications should be checked', async () => {
  // start store with user data that has email notifications turned on
  render(<Settings />, {
    initialState: {
      auth: {
        id: 'testid',
        email: 'testemail@email.com',
        emailNotifications: true,
      },
    },
  });
  expect(
    screen
      .getByLabelText('toggle email notifications')
      .getAttribute('aria-checked')
  ).toBe('true');
});

test('React slide for email notifications should be unchecked', async () => {
  // start store with user data that has email notifications turned off
  render(<Settings />, {
    initialState: {
      auth: {
        id: 'testid',
        email: 'testemail@email.com',
        emailNotifications: false,
      },
    },
  });
  expect(
    screen
      .getByLabelText('toggle email notifications')
      .getAttribute('aria-checked')
  ).toBe('false');
});

test('Clicking react slide for email notifications should change it', async () => {
  mock
    .onPatch('/auth/users/me/email/notifications')
    .reply(200, { emailNotifications: false });
  // start store with user data that has email notifications turned off
  render(<Settings />, {
    initialState: {
      auth: {
        id: 'testid',
        email: 'testemail@email.com',
        emailNotifications: true,
      },
    },
  });
  userEvent.click(screen.getByLabelText('toggle email notifications'));
  await waitFor(() =>
    expect(
      screen
        .getByLabelText('toggle email notifications')
        .getAttribute('aria-checked')
    ).toBe('false')
  );
});
