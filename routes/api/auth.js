const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator/check');
const config = require('config');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

//@route   GET api/auth
//@desc    Test route
//@access  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route   POST api/auth
//@desc    Authenticate user & Get token
//@access  Public
router.post(
  '/',
  [
    check('admno', 'Please enter a valid Admission Number').not().isEmpty(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { password, admno } = req.body;

    try {
      //See if user exists
      let user = await User.findOne({ admno });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User does not exist' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Password Incorrect' }] });
      }

      //Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, config.get('jwtSecret'), (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
