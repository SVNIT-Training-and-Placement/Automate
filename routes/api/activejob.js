const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

const ActiveJob = require('../../models/Activejob');
const auth = require('../../middleware/auth');
const req = require('express/lib/request');
const res = require('express/lib/response');

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

module.exports = router;
