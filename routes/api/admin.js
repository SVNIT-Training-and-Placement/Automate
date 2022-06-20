const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator/check');
const config = require('config');

const Admin = require('../../models/Admin');

//@route   POST api/admin
//@desc    Register admin
//@access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please Enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      //See if admin exists
      let admin = await Admin.findOne({ email });

      if (admin) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Admin already exists' }] });
      }

      admin = new Admin({
        name,
        email,
        password,
      });

      //Encrypt password
      const salt = await bcrypt.genSalt(10);

      admin.password = await bcrypt.hash(password, salt);

      await admin.save();

      //Return jsonwebtoken
      const payload = {
        admin: {
          id: admin.id,
        },
      };

      jwt.sign(payload, config.get('jwtSecret'), (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server error');
    }
  }
);

module.exports = router;
