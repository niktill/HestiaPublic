import React from 'react';
// We're using our own custom render function and not RTL's render
// our custom utils also re-export everything from RTL
// so we can import fireEvent and screen here as well
import { renderWithRouter, userEvent, screen } from './test-utils';
import MobileDashboard from '../components/MobileDashboard';

// Mock Components
jest.mock('../components/Athletes', () => () => (
  <span>Mock Athletes Component</span>
));
jest.mock('../components/Settings', () => () => (
  <span>Mock Settings Component</span>
));
jest.mock('../components/AthletePage', () => () => (
  <span>Mock AthletePage Component</span>
));

test('Display athletes component on / route', () => {
  renderWithRouter(<MobileDashboard />, {}, { route: '/' });
  // check that mock athletes component renders
  expect(screen.getByText('Mock Athletes Component')).toBeInTheDocument();
});

test('Display athletes component on incorrect route', () => {
  renderWithRouter(<MobileDashboard />, {}, { route: '/bad-route' });
  // check that mock athletes component renders
  expect(screen.getByText('Mock Athletes Component')).toBeInTheDocument();
});

test('Display athletes component on /athletes route', () => {
  renderWithRouter(<MobileDashboard />, {}, { route: '/athletes' });
  // check that mock athletes component renders
  expect(screen.getByText('Mock Athletes Component')).toBeInTheDocument();
});

test('Display athlete page componenet on /athletes/:id route', () => {
  renderWithRouter(<MobileDashboard />, {}, { route: '/athletes/123456' });
  // check that mock athlete page component renders
  expect(screen.getByText('Mock AthletePage Component')).toBeInTheDocument();
});

test('Display settings component on /settings route', () => {
  renderWithRouter(<MobileDashboard />, {}, { route: '/settings' });
  // check that mock settings component renders
  expect(screen.getByText('Mock Settings Component')).toBeInTheDocument();
});

test('Display settings component after clicking settings tab', () => {
  renderWithRouter(<MobileDashboard />, {}, { route: '/athletes' });
  // click settings tab on mobile dashboard
  userEvent.click(screen.getByText(/Settings/i));
  // check that mock athletes component renders by default
  expect(screen.getByText('Mock Settings Component')).toBeInTheDocument();
});
