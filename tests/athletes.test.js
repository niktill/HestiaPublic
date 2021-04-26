const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Athletes = require('../models/Athlete');
const IMUEntry = require('../models/IMUEntry');

const user = request.agent(app);

// set up default test database state before each test
beforeAll(async (done) => {
  try {
    await User.deleteMany();
    await Athletes.deleteMany();
    await IMUEntry.deleteMany();
    await new User({
      _id: '604a5201c99e193f70874158',
      email: 'testemail3@email.com',
      password: 'testpass1',
    }).save();
    // start user with one athlete already created
    await new Athletes({
      _id: '604a5cdb7ce5b6103c5f6ef5',
      name: 'Nik T',
      userObjectId: '604a5201c99e193f70874158',
    }).save();
    // start athlete with one imu entry
    await new IMUEntry({
      _id: '6064a8a2d52ad03de4939638',
      name: 'game3_mens7.csv',
      date: new Date(2021, 5, 6, 9),
      maxAcceleration: 3.0,
      impacts: 20,
      uploadDate: new Date(2021, 5, 6, 18),
      athleteObjectId: '604a5cdb7ce5b6103c5f6ef5',
      csv: 'testcsvstring',
    }).save();
    // start user logged in
    await user
      .post('/auth/login')
      .send({ email: 'testemail3@email.com', password: 'testpass1' })
      .expect(302);
  } catch (err) {
    console.log(err);
  }
  done();
});

// tear down for jest after all tests
afterAll((done) => {
  mongoose.connection.close();
  done();
});

// get all athelets
test('Should return all athletes for user', async (done) => {
  const res = await user.get('/api/athletes');
  expect(res.status).toBe(200);
  expect(res.body.length).toBe(1);
  const { name } = res.body[0];
  expect(name).toBe('Nik T');
  done();
});

// get one athlete
test('Should return one athlete and their IMU data', async (done) => {
  const res = await user.get('/api/athletes/604a5cdb7ce5b6103c5f6ef5');
  expect(res.status).toBe(200);
  const { imuData } = res.body;
  expect(Array.isArray(imuData)).toBe(true);
  expect(imuData.length).toBe(1);
  expect(imuData[0].name).toBe('game3_mens7.csv');
  const { name } = res.body;
  expect(name).toBe('Nik T');
  done();
});

// create athlete for user
test('Should create athlete for user', async (done) => {
  // create athlete
  const res = await user.post('/api/athletes').send({ name: 'Fabian U' });
  expect(res.status).toBe(201);
  expect(res.body.name).toBe('Fabian U');
  // get all athletes and expect two athletes total
  const res2 = await user.get('/api/athletes');
  expect(res2.status).toBe(200);
  expect(res2.body.length).toBe(2);
  const name1 = res2.body[0].name;
  const name2 = res2.body[1].name;
  expect([name1, name2]).toEqual(expect.arrayContaining(['Fabian U', 'Nik T']));
  done();
});

// delete athlete for user
test('Should delete athlete for user', async (done) => {
  // delete athlete
  const res = await user.delete('/api/athletes/604a5cdb7ce5b6103c5f6ef5');
  expect(res.status).toBe(200);
  // get all athletes and expect one athlete total
  const res2 = await user.get('/api/athletes');
  expect(res2.status).toBe(200);
  expect(res2.body.length).toBe(1);
  const { name } = res2.body[0];
  expect(name).toBe('Fabian U');
  done();
});

// do not delete athlete that does not exist for user
test('Should not delete invalid athlete for user', async (done) => {
  // delete athlete
  const res = await user.delete('/api/athletes/604a5cdb7ce5b6103c5f6ef5');
  expect(res.status).toBe(404);
  done();
});
