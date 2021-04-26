import React from 'react';
// We're using our own custom render function and not RTL's render
// our custom utils also re-export everything from RTL
// so we can import userEvent and screen here as well
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { render, userEvent, screen } from './test-utils';
import IMUTable from '../components/athletePageComponents/IMUTable';

const mock = new MockAdapter(axios);

test('If IMU upload fail it should show error message from api response', async () => {
  // mock response from upload imu route
  mock.onPost('/api/athletes/testId/imu').reply(400, { message: 'test error message' });
  render(<IMUTable athleteId='testId' />, {});
  const file = new File(['hello'], 'hello.png', {type: 'image/png'})
  userEvent.upload(screen.getByLabelText('IMU csv file input'), file);
  userEvent.click(screen.getByLabelText('upload file'));

  expect(await screen.findByText('test error message')).toBeInTheDocument();
});

test('If IMU upload success it should show success message from api response', async () => {
    // mock response from upload imu route
    mock.onPost('/api/athletes/testId/imu').reply(200, { newImuEntry: {
        _id: 'testImuId',
      name: 'game1_mens7.csv',
      date: new Date(2021, 5, 6, 9),
      maxAcceleration: 5.4,
      impacts: 55,
      uploadDate: new Date(2021, 5, 6),
      athleteObjectId: 'testId',
      processed: true,
      csv: 'testcsv',
    } });
    render(<IMUTable athleteId='testId' />, {});
    const file = new File(['hello'], 'hello.csv', {type: 'application/vnd.ms-excel'})
    userEvent.upload(screen.getByLabelText('IMU csv file input'), file);
    userEvent.click(screen.getByLabelText('upload file'));
  
    expect(await screen.findByText('IMU file uploaded successfully!')).toBeInTheDocument();
  });
