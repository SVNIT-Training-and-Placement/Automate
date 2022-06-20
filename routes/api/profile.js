const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

const auth = require('../../middleware/auth');

//@route   GET api/profile/me
//@desc    Get current user's profile
//@access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this User' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route   POST api/profile
//@desc    Create or Update profile
//@access  Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'name is required').not().isEmpty(),
      check('email', 'Valid email is required').isEmail(),
      check('gender', 'Gender is required').not().isEmpty(),
      check('passout', 'Passout year is required').not().isEmpty(),
      check('phoneno', 'Phone number is required').not().isEmpty(),
      check('dept', 'Department is required').not().isEmpty(),
      check('percentage10', '10th Percentage is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // destructure the request
    const { name, email, gender, passout, phoneno, percentage10, dept } =
      req.body;

    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;

    if (name) profileFields.name = name;
    if (email) profileFields.email = email;
    if (gender) profileFields.gender = gender;
    if (passout) profileFields.passout = passout;
    if (phoneno) profileFields.phoneno = phoneno;
    if (percentage10) profileFields.percentage10 = percentage10;
    if (dept) profileFields.dept = dept;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //Update if found
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      //Create if not there
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
