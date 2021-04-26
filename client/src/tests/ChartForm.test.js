import React from 'react';
// We're using our own custom render function and not RTL's render
// our custom utils also re-export everything from RTL
// so we can import userEvent and screen here as well
import { render, screen } from './test-utils';
import ChartForm from '../components/athletePageComponents/ChartForm';

test('Chart Form should show props as default values in forms', () => {
  const testStartDate = new Date();
  render(<ChartForm startDate={testStartDate} gameRange={6} />, {});
  const testDateMonthString = `0${testStartDate.getMonth() + 1}`.slice(-2);
  const testDateString = `0${testStartDate.getDate()}`.slice(-2);
  const testStartDateInput = `${testStartDate.getFullYear()}-${testDateMonthString}-${testDateString}`;

  expect(screen.getByLabelText('Start Date:').getAttribute('value')).toBe(
    testStartDateInput
  );
  expect(
    screen
      .getByLabelText('Number of IMU Uploads Displayed:')
      .getAttribute('value')
  ).toBe('6');
});
