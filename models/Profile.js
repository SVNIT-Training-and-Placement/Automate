const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneno: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  dept: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
  },
  passout: {
    type: String,
    required: true,
  },
  percentage10: {
    type: String,
    required: true,
  },
  percentage12: {
    type: String,
  },
  sem1: {
    type: String,
  },
  sem2: {
    type: String,
  },
  sem3: {
    type: String,
  },
  sem4: {
    type: String,
  },
  sem5: {
    type: String,
  },
  sem6: {
    type: String,
  },
  sem7: {
    type: String,
  },
  activebacklog: {
    type: String,
  },
  resumelink: {
    type: String,
  },
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
