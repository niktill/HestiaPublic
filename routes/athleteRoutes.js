const mongoose = require('mongoose');
const csv = require('csvtojson');
const Athlete = require('../models/Athlete');
const { checkAuth } = require('../middleware/auth');
const IMUEntry = require('../models/IMUEntry');

module.exports = (app) => {
  // get all user athletes
  app.get('/api/athletes', checkAuth, async (req, res, next) => {
    try {
      if (!req.user.id) {
        return res.status(400).send('User id not found!');
      }
      const { _id } = req.user;
      const athletes = await mongoose
        .model('athletes')
        .find({ userObjectId: _id });
      return res.status(200).send(athletes);
    } catch (err) {
      // get all athletes not successful
      return next(err);
    }
  });

  // get athlete by id and their IMU entry data
  app.get('/api/athletes/:id', checkAuth, async (req, res, next) => {
    try {
      if (!req.user.id) {
        return res.status(400).send('User id not found!');
      }
      // fetch athlete from db
      const userId = req.user.id;
      const id = req.params.id;
      const athlete = await mongoose
        .model('athletes')
        .findOne({ _id: id, userObjectId: userId })
        .lean();
      if (!athlete) {
        return res.status(404).send('Athlete not found');
      }
      // fetch athlete's imu data and attach to response
      const athleteIMUData = await IMUEntry.find({
        athleteObjectId: req.params.id,
      });
      athlete.imuData = athleteIMUData;
      return res.status(200).send(athlete);
    } catch (err) {
      // get athlete not successful
      return next(err);
    }
  });

  // create new athlete
  app.post('/api/athletes', checkAuth, async (req, res, next) => {
    try {
      if (!req.user.id) {
        return res.status(400).send('User id not found!');
      }
      const { name } = req.body;
      const userObjectId = mongoose.Types.ObjectId(req.user.id);
      const athleteData = { name, userObjectId };
      const athlete = new Athlete(athleteData);
      await athlete.save();
      return res.status(201).send(athlete);
    } catch (err) {
      // create athlete not successful
      return next(err);
    }
  });

  // delete athlete and their imu entries
  app.delete('/api/athletes/:id', checkAuth, async (req, res, next) => {
    try {
      if (!req.user.id) {
        return res.status(400).send('User id not found!');
      }
      const userId = req.user.id;
      const id = req.params.id;
      const athlete = await Athlete.findOneAndDelete({
        _id: id,
        userObjectId: userId,
      });
      if (!athlete) {
        return res.status(404).send('Athlete does not exist');
      }
      await IMUEntry.deleteMany({ athleteObjectId: id });
      return res.status(200).send(athlete);
    } catch (err) {
      // delete athlete not successful
      return next(err);
    }
  });

  // ---Upload IMU csv file for athlete---
  // Multer config
  const multer = require('multer');
  // memory storage deletes file after route is done
  const storage = multer.memoryStorage();
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 20000000, // 20MB
    },
    async fileFilter(req, file, cb) {
      if (!file.originalname.endsWith('.csv')) {
        return cb(new Error('File must be a CSV'), false);
      }
      try {
        // reject file upload if uploaded is not associated with athlete
        const userId = req.user.id;
        const athleteId = req.params.id;
        const athlete = await mongoose
          .model('athletes')
          .findOne({ _id: athleteId, userObjectId: userId });
        if (!athlete) {
          return cb(new Error('Unauthorized'), false);
        }
        // file upload successful
        return cb(undefined, true);
      } catch (error) {
        return cb(error, false);
      }
    },
  }).single('upload');

  // Upload IMU csv file for athlete route
  app.post('/api/athletes/:id/imu', checkAuth, async (req, res, next) => {
    upload(req, res, async function (err) {
      // check if error occured during upload
      if (err) {
        if (
          err instanceof multer.MulterError ||
          err.message === 'File must be a CSV'
        ) {
          // A Multer error occurred when uploading.
          return res.status(400).send({ ...err, message: err.message });
        }
        // An unknown error occurred when uploading.
        return next(err);
      }
      // no error with Multer
      try {
        // save new unprocessed imu entry
        const { file } = req;
        const athleteId = req.params.id;
        // const jsonCsv = await csv().fromString(file.buffer.toString());
        const imuEntry = new IMUEntry({
          name: file.originalname,
          csv: file.buffer.toString(),
          date: null,
          impacts: -1,
          maxAcceleration: -1,
          uploadDate: Date.now(),
          athleteObjectId: mongoose.Types.ObjectId(athleteId),
          processed: false,
        });
        const newImuEntry = await imuEntry.save();

        // send back newIMUEntry and athlete
        res.status(200).send({ newImuEntry });
      } catch (err) {
        // Error with extracting data from uploaded imu csv
        return next(err);
      }
    });
  });
};
