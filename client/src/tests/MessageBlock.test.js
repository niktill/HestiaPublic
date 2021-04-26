import React from 'react';
// We're using our own custom render function and not RTL's render
// our custom utils also re-export everything from RTL
// so we can import userEvent and screen here as well
import { renderWithRouter, screen } from './test-utils';
import MessageBlock from '../components/MessageBlock';

test('Should show message text from props', async () => {
  // expect MessageBlock name to be shown if passed as prop to MessageBlock Component
  renderWithRouter(<MessageBlock message='hello world' />, {});
  expect(screen.getByText('hello world')).toBeInTheDocument();
});
