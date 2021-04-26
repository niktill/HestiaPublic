const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = mongoose.model('users');

// set up default test database state before each test
beforeAll(async (done) => {
  try {
    await User.deleteMany();
    await new User({
      email: 'testemail1@email.com',
      password: 'testpass1',
    }).save();
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

// create new unique user
test('Should signup a new unique user and redirect to dashboard', async (done) => {
  const res = await request(app)
    .post('/auth/users')
    .send({ email: 'testemail2@email.com', password: 'testpass2' });

  expect(res.status).toBe(302);
  done();
});

// try and create user with same email
test('Should not signup a new user with email same as another user', async (done) => {
  const res = await request(app)
    .post('/auth/users')
    .send({ email: 'testemail1@email.com', password: 'testpass1' });

  expect(res.status).toBe(400);
  done();
});

// login with existing user
test('Should login existing user', async (done) => {
  await request(app)
    .post('/auth/login')
    .send({ email: 'testemail1@email.com', password: 'testpass1' })
    .expect(302)
    .expect('Location', '/');
  done();
});

// do not login invalid user
test('Should not login invalid user', async (done) => {
  await request(app)
    .post('/auth/login')
    .send({ email: 'wrongemail@email.com', password: 'doesnotexist' })
    .expect(401);
  done();
});

// do not logout user who is not logged in
test('Should not logout user', async (done) => {
  await request(app)
    .post('/auth/logout')
    .expect(302)
    .expect('Location', '/login');
  done();
});

// return no data
test('Should return no user data', async (done) => {
  const res = await user.get('/auth/users/me');
  expect(res.body.email).toBe(undefined);
  done();
});

// Tests below are for after user has logged in
// variable user will be treated as a persisting user making api calls
const user = request.agent(app);

describe('Tests after user has logged in', function () {
  // login user before all tests
  beforeAll(async (done) => {
    await user
      .post('/auth/login')
      .send({ email: 'testemail1@email.com', password: 'testpass1' })
      .expect(302)
      .expect('Location', '/');
    done();
  });

  // return logged in user data
  test('Should return user data', async (done) => {
    const res = await user.get('/auth/users/me');
    expect(res.body.email).toBe('testemail1@email.com');
    // email notifications should be set to true by default when user created
    expect(res.body.emailNotifications).toBe(true);
    done();
  });

  // change user email and password and then relogin with changed credentials
  test('Should change user email/password and relogin successfully with new credentials', async (done) => {
    // change email address of user
    await user
      .patch('/auth/users/me/email')
      .send({ email: 'testnewemail1@email.com' })
      .expect(200);
    // change password of user
    await user
      .patch('/auth/users/me/password')
      .send({
        email: 'testnewemail1@email.com',
        password: 'testpass1',
        newPassword: 'testpass2',
      })
      .expect(200);
    // logout user
    await user.post('/auth/logout').expect(302).expect('Location', '/login');
    // successfully login user with new credentials
    await user
      .post('/auth/login')
      .send({ email: 'testnewemail1@email.com', password: 'testpass2' })
      .expect(302)
      .expect('Location', '/');
    done();
  });

  // turn off email notifications for user
  test('Should toggle off email notifications for user', async (done) => {
    const res = await user
      .patch('/auth/users/me/email/notifications')
      .send({ toggle: false });
    expect(res.body.emailNotifications).toBe(false);
    done();
  });
});
