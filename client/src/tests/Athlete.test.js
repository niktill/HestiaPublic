import React from 'react';
// We're using our own custom render function and not RTL's render
// our custom utils also re-export everything from RTL
// so we can import userEvent and screen here as well
import { renderWithRouter, userEvent, screen } from './test-utils';
import Athlete from '../components/Athlete';

test('Should show name of athlete in Athlete component', async () => {
  // expect Athlete name to be shown if passed as prop to Athlete Component
  renderWithRouter(<Athlete name='Henry Jorbens' id='testid' />, {});
  expect(screen.getByText('Henry Jorbens')).toBeInTheDocument();
});

test('Clicking on delete Button on Athlete Component should open confirm modal', async () => {
  // expect condAthlete name to be shown if pass as prop to Athlete Component
  renderWithRouter(<Athlete name='Henry Jorbens' id='testid' />, {});
  userEvent.click(screen.getByLabelText('delete athlete'));
  expect(
    screen.getByText('Are you sure you want to delete this athlete?')
  ).toBeInTheDocument();
});
