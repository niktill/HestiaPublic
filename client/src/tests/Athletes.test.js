import React from 'react';
// We're using our own custom render function and not RTL's render
// our custom utils also re-export everything from RTL
// so we can import userEvent and screen here as well
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { render, userEvent, screen } from './test-utils';
import Athletes from '../components/Athletes';

const mock = new MockAdapter(axios);

jest.mock('../components/Athlete', () => () => (
  <span key='test string'>Mock Athlete Component</span>
));

test('Renders two mock athlete components on athletes component', async () => {
  // mock response to fetch users athletes
  mock.onGet('/api/athletes').reply(200, [
    {
      name: 'Henry Jorbens',
      userObjectId: 'testUserId1',
      __v: 0,
      _id: 'testId1',
    },
    {
      name: 'Nik T',
      userObjectId: 'testUserId2',
      __v: 0,
      _id: 'testId2',
    },
  ]);
  render(<Athletes />, { initialState: {} });
  const mockAthletes = await screen.findAllByText('Mock Athlete Component');
  // expect two mock athlete components to show up on athletes component
  expect(mockAthletes.length).toBe(2);
});

test('Should render mock athlete after adding athlete with form on athletes component', async () => {
  // mock response to fetch user's athletes
  mock.onGet('/api/athletes').reply(200, []);
  // mock response to add athlete
  mock.onPost('/api/athletes').reply(200, {
    name: 'Henry Jorbens',
    userObjectId: 'testUserId1',
    __v: 0,
    _id: 'testId1',
  });
  render(<Athletes />, { initialState: {} });
  let mockAthletes = screen.queryAllByText('Mock Athlete Component');
  expect(mockAthletes.length).toBe(0);
  // add name to add athlete form on athletes component
  userEvent.type(screen.getByLabelText('Add Athlete'));
  userEvent.click(screen.getByLabelText('add athlete button'));
  mockAthletes = await screen.findAllByText('Mock Athlete Component');
  // expect the added fake mock athlete to show up on athletes component
  expect(mockAthletes.length).toBe(1);
});
