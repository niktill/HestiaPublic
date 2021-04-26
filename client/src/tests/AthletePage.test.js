import React from 'react';
// We're using our own custom render function and not RTL's render
// our custom utils also re-export everything from RTL
// so we can import userEvent and screen here as well
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Route } from 'react-router-dom';
import { renderWithRouter, userEvent, screen } from './test-utils';
import AthletePage from '../components/AthletePage';

const mock = new MockAdapter(axios);

test('Renders athlete name and impact limit on athlete page', async () => {
  // mock reponse from fetch athlete data
  mock.onGet('/api/athletes/testid1').reply(200, {
    _id: 'testid1',
    name: 'Henry Jorbens',
    userId: 'testid2',
    impactLimit: 45,
    imuData: [],
  });
  // mock url route of athlete page component
  renderWithRouter(
    <Route path='/athletes/:id' component={AthletePage} />,
    {},
    { route: '/athletes/testid1' }
  );
  // expect athlete name and impact limit to render
  expect(await screen.findByText(/Henry Jorbens/i)).toBeInTheDocument();
  expect(await screen.findByText(/45/i)).toBeInTheDocument();
});

test('Renders message on athlete page if athlete does not have impact limit', async () => {
  // mock reponse from fetch athlete data
  mock.onGet('/api/athletes/testid1').reply(200, {
    _id: 'testid1',
    name: 'Henry Jorbens',
    userId: 'testid2',
    impactLimit: null,
    imuData: [],
  });
  // mock url route of athlete page component
  renderWithRouter(
    <Route path='/athletes/:id' component={AthletePage} />,
    {},
    { route: '/athletes/testid1' }
  );
  // expect no impact limit message if athlete does not have one yet
  expect(
    await screen.findByText(/Impact limit not determined/i)
  ).toBeInTheDocument();
});

test('Renders athlete not found message if athlete not found', async () => {
  // mock reponse from fetch athlete data
  mock.onGet('/api/athletes/testid1').reply(404);
  // mock url route of athlete page component
  renderWithRouter(
    <Route path='/athletes/:id' component={AthletePage} />,
    {},
    { route: '/athletes/testid1' }
  );
  // expect athlete not found message if fetch athlete gives 404
  expect(await screen.findByText(/Athlete not found/i)).toBeInTheDocument();
});

test('Renders confirm modal when click on delete athlete button', async () => {
  // mock reponse from fetch athlete data
  mock.onGet('/api/athletes/testid1').reply(200, {
    _id: 'testid1',
    name: 'Henry Jorbens',
    userId: 'testid2',
    impactLimit: null,
    imuData: [],
  });
  // mock url route of athlete page component
  renderWithRouter(
    <Route path='/athletes/:id' component={AthletePage} />,
    {},
    { route: '/athletes/testid1' }
  );
  // click delete athlete button
  userEvent.click(await screen.findByLabelText('delete athlete'));
  // expect confirm model to be opened
  expect(
    screen.getByText(/Are you sure you want to delete this athlete/i)
  ).toBeInTheDocument();
});

test('Closes confirm modal when click on cancel button', async () => {
  // mock reponse from fetch athlete data
  mock.onGet('/api/athletes/testid1').reply(200, {
    _id: 'testid1',
    name: 'Henry Jorbens',
    userId: 'testid2',
    impactLimit: null,
    imuData: [],
  });
  // mock delete athlete api
  mock.onDelete('/api/athletes/testid1').reply(200);
  // mock url route of athlete page component
  renderWithRouter(
    <Route path='/athletes/:id' component={AthletePage} />,
    {},
    { route: '/athletes/testid1' }
  );
  // click delete athlete button
  userEvent.click(await screen.findByLabelText('delete athlete'));
  userEvent.click(await screen.findByText('Cancel'));
  // expect confirm model to be opened
  expect(
    screen.queryByText(/Are you sure you want to delete this athlete/i)
  ).not.toBeInTheDocument();
});
