const mongoose = require('mongoose');

const ActivejobsSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  jd: {
    type: String,
  },
  branches: {
    type: [String],
    required: true,
  },
  stipend: {
    type: String,
  },
  cgpa: {
    type: String,
  },
  responses: [
    {
      //add the fields of students here
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = ActiveJob = mongoose.model('activejob', ActivejobsSchema);
