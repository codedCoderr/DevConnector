const express = require('express');
const router = express.Router();
// const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware');

const { jwtsecret } = process.env;

router.post(
  '/register',

  async (req, res) => {
    try {
      const { name, email, password, password2 } = req.body;
      if (!name) return res.status(400).send('Name is required');
      if (!email) return res.status(400).send('Email is required');
      if (!password)
        return res
          .status(400)
          .send('Enter a password of three or more characters');

      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .send('Error registering,enter a different email');
      }
      if (password !== password2) {
        return res.status(400).send('Passwords do not match');
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
      res.status(200).send(token);
    } catch (error) {
      res.status(500).send('Error registering user');
    }
  }
);

router.post(
  '/login',

  async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email) return res.status(400).send('Email is required');
      if (!password) return res.status(400).send('Password is required');
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send('Invalid credentials');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send('Invalid credentials');
      }
      const payload = {
        user: {
          id: user.id,
          name: user.name
        }
      };
      const token = await jwt.sign(payload, jwtsecret, { expiresIn: 360000 });
      res.status(200).send(token);
    } catch (error) {
      res.status(500).send('Error logging in');
    }
  }
);

router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(400).send('No signed in user');
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send('Error getting user');
  }
});
module.exports = router;
