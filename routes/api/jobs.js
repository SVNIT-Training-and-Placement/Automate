const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

const Jobs = require('../../models/Jobs');
const ActiveJob = require('../../models/Activejob');
const auth = require('../../middleware/auth');
const req = require('express/lib/request');
const res = require('express/lib/response');

//@route   POST api/jobs
//@desc    Create Job
//@access  Private
router.post(
  '/',
  [
    auth,
    [
      check('company', 'Comapany name is required').not().isEmpty(),
      check('branches', 'Branches is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // destructure the request
    const { company, branches, jd, cgpa, stipend } = req.body;

    //Build jobs object
    const postFields = {};

    if (company) postFields.company = company;
    if (jd) postFields.jd = jd;
    if (cgpa) postFields.cgpa = cgpa;
    if (stipend) postFields.stipend = stipend;

    if (branches) {
      postFields.branches = branches.split(',').map((branch) => branch.trim());
    }

    try {
      const job = new Jobs(postFields);
      const activejob = new ActiveJob(postFields);

      await job.save();
      await activejob.save();
      res.json(job);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route   GET api/jobs
//@desc    Get all Job
//@access  Private
router.get('/', auth, async (req, res) => {
  try {
    const alljobs = await Jobs.find().sort({ date: -1 });
    res.json(alljobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
