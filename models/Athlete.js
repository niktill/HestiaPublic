const mongoose = require('mongoose');

const { Schema } = mongoose;

// Checks if user that athlete is asssigned to is valid
async function validateUser(userObjectId) {
  try {
    const user = await mongoose.model('users').findById(userObjectId);
    if (!user) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

const athleteSchema = new Schema({
  userObjectId: {
    type: Schema.Types.ObjectId,
    required: true,
    validate: {
      validator: validateUser,
      message: 'The User that the athlete is assigned to is not valid',
    },
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  impactLimit: { type: Number, required: false },
  lastImpactLimitCalculationDate: { type: Date, required: false },
});

const Athlete = mongoose.model('athletes', athleteSchema);

module.exports = Athlete;
