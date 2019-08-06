const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware');

const { jwtsecret } = process.env;

router.post(
  '/register',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 3 or more characters'
    ).isLength({ min: 3 }),
    check(
      'password2',
      'Confirm your password'
    ).isLength({ min: 3 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { name, email, password, password2 } = req.body;

      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Error registering,enter a different email' }] });
      }
      if (password !== password2) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Passwords do not match' }] });
      }
      user = new User({
        name,
        email,
        password
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = {
        user: {
          id: user.id,
          name: user.name
        }
      };
      const token = await jwt.sign(payload, jwtsecret, {
        expiresIn: 360000
      });
      res.json(token);
    } catch (error) {
      res.status(500).send({ errors: [{ msg: 'Error registering user' }] });
    }
  }
);

router.post(
  '/login',
  [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }
      const payload = {
        user: {
          id: user.id,
          name: user.name
        }
      };
      const token = await jwt.sign(payload, jwtsecret, { expiresIn: 360000 });
      res.json(token);
    } catch (error) {
      res.status(500).json({ errors: [{ msg: 'Error logging in' }] });
    }
  }
);

router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'No signed in user' }] });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ errors: [{ msg: 'Error getting user' }] });
  }
});
module.exports = router;
