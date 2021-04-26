const validator = require('validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    },
  },
  password: {
    type: String,
    trim: true,
  },
  emailNotifications: {
    type: Boolean,
    default: true,
  },
});

// remove sensitive data when sending user
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

// middleware for hashing password
userSchema.pre('save', async function (next) {
  try {
    const user = this;
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('users', userSchema);

module.exports = User;
