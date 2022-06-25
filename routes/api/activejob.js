const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

const ActiveJob = require('../../models/Activejob');
const Profile = require('../../models/Profile');
const auth = require('../../middleware/auth');
const req = require('express/lib/request');
const res = require('express/lib/response');
const { response } = require('express');

//@route   GET api/activejobs
//@desc    Get all Active Jobs
//@access  Private
router.get('/', auth, async (req, res) => {
  try {
    const activejobs = await ActiveJob.find().sort({ date: -1 });
    res.json(activejobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route   DELETE api/activejobs
//@desc    Delete a Active Job
//@access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const activejob = await ActiveJob.findById(req.params.id);

    if (!activejob) {
      return res.status(404).json({ msg: 'ActiveJob not found' });
    }

    await activejob.remove();
    res.json({ msg: 'ActiveJob removed ' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route   PUT api/activejobs/response/:id
//@desc    Respond to a Active Job
//@access  Private
router.put('/response/:id', auth, async (req, res) => {
  try {
    const job = await ActiveJob.findById(req.params.id);
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['admno']
    );

    (job.responses = []),
      //profile.user.admno

      // console.log(profile);
      // console.log(job);

      //check if job already responded by user
      // if (
      //   job.responses.filter(
      //     (response) => response.user.id.toString() === req.user.id
      //   ).length > 0
      // ) {
      //   return res.status(400).json({ msg: 'Already responded to this job' });
      // }

      //add reponse
      job.responses.unshift({ user: req.user.id });
    job.responses.unshift({ name: profile.name });
    job.responses.unshift({ admno: profile.user.admno });
    job.responses.unshift({ email: profile.email });
    job.responses.unshift({ phoneno: profile.phoneno });
    job.responses.unshift({ dept: profile.dept });
    job.responses.unshift({ passout: profile.passout });
    job.responses.unshift({ percentage10: profile.percentage10 });
    job.responses.unshift({ gender: profile.gender });

    await job.save();
    //res.json({ msg: 'Job response added' });

    res.json(job.responses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
