// This script adds the a test user to the local mongodb database:

const keys = require('../config/keys.js');

async function addTestUsertoDatabase() {
  const mongoose = require('mongoose');
  const User = require('../models/User');
  const Athlete = require('../models/Athlete');
  const IMUEntry = require('../models/IMUEntry');

  try {
    mongoose.connect(keys.mongoURI);
    const userId = mongoose.Types.ObjectId();
    const user = new User({
      _id: userId,
      email: 'niktill123@gmail.com',
      password: 'testpass5',
      emailNotifications: true,
    });
    await user.save();

    const athleteId = mongoose.Types.ObjectId();

    const athlete = new Athlete({
      _id: athleteId,
      name: 'Nik T',
      userObjectId: userId,
    });
    await athlete.save();

    const imuEntry1Id = mongoose.Types.ObjectId();

    const imuEntry1 = new IMUEntry({
      _id: imuEntry1Id,
      name: 'game1_mens7.csv',
      date: new Date(2021, 5, 6, 9),
      maxAcceleration: 5.4,
      impacts: 55,
      uploadDate: new Date(2021, 5, 6),
      athleteObjectId: athleteId,
      processed: true,
      csv: 'testcsv',
    });
    await imuEntry1.save();

    const imuEntry2Id = mongoose.Types.ObjectId();

    const imuEntry2 = new IMUEntry({
      _id: imuEntry2Id,
      name: 'game2_mens7.csv',
      date: new Date(2021, 5, 7, 14),
      maxAcceleration: 5,
      impacts: 35,
      uploadDate: new Date(2021, 5, 7),
      athleteObjectId: athleteId,
      processed: true,
      csv: 'testcsv',
    });
    await imuEntry2.save();

    const imuEntry3Id = mongoose.Types.ObjectId();

    const imuEntry3 = new IMUEntry({
      _id: imuEntry3Id,
      name: 'game3_mens7.csv',
      date: null,
      maxAcceleration: -1,
      impacts: -1,
      uploadDate: new Date(2021, 5, 9),
      athleteObjectId: athleteId,
      processed: false,
      csv: 'testcsv',
    });
    await imuEntry3.save();

    mongoose.connection.close();
  } catch (error) {
    console.log(error);
    mongoose.connection.close();
  }
}

addTestUsertoDatabase();
