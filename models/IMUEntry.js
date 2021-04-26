const mongoose = require('mongoose');

const { Schema } = mongoose;

// Checks if athlete that imu entry is asssigned to is valid
async function validateAthlete(athleteObjectId) {
  try {
    const athlete = await mongoose.model('athletes').findById(athleteObjectId);
    if (!athlete) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

const imuEntrySchema = new Schema({
  athleteObjectId: {
    type: Schema.Types.ObjectId,
    required: true,
    validate: {
      validator: validateAthlete,
      message: 'The Athlete that the IMU entry is assigned to is not valid',
    },
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: false,
  },
  uploadDate: {
    type: Date,
    required: true,
  },
  impacts: {
    type: Number,
    default: -1,
  },
  maxAcceleration: {
    type: Number,
  },
  processed: {
    type: Boolean,
    default: false,
  },
  csv: {
    type: String,
    required: true,
  },
});

const IMUEntry = mongoose.model('imuEntry', imuEntrySchema);

module.exports = IMUEntry;
