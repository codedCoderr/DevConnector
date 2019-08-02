const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const User = require('../models/User');
const auth = require('../middleware');
const { check, validationResult } = require('express-validator');

router.get('/profile/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name']
    );
    if (!profile) {
      return res.json({ msg: 'No profile for this user' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});
router.post(
  '/profile',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      avatar,
      company,
      website,
      location,
      status,
      skills,
      bio,
      github,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
      githubusername
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (avatar) profileFields.avatar = avatar;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;
    if (github) profileFields.social.github = github;

    try {
      let profile = await Profile.findOne({ user: req.user.id }).populate(
        'user',
        ['name']
      );
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      profile = await new Profile(profileFields).populate('user', ['name']);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

router.get('/profile', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name']);
    if (profiles.length <= 0) {
      return res.status(400).json({
        msg: 'There are currently no profiles,be the first to add one'
      });
    }
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/profile/:user_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name']);
    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});
router.delete('/profile', auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});
router.post(
  '/profile/experience',
  [
    auth,
    [
      check('title', 'Title is required')
        .not()
        .isEmpty(),
      check('company', 'Company is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      from,
      to,
      current,
      location,
      description
    } = req.body;
    const newExp = {
      title,
      company,
      from,
      to,
      current,
      location,
      description
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return res.status(500).json({ msg: 'No profile for this user' });
      }
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (error) {
      res.status(500).json({ msg: 'Server error' });
    }
  }
);
router.delete('/profile/experience/:exp_id', auth, async (req, res) => {
  const { exp_id } = req.params;
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    });
    if (!profile) {
      return res.status(500).json({ msg: 'Experience not found' });
    }
    const removeIndex = profile.experience.map(item => item.id).indexOf(exp_id);
    if (removeIndex === -1) {
      return res.status(500).json({ msg: 'Experience not found' });
    }
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Experience not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});
router.post(
  '/profile/education',
  [
    auth,
    [
      check('school', 'School is required')
        .not()
        .isEmpty(),
      check('degree', 'Degree is required')
        .not()
        .isEmpty(),
      check('degree', 'Degree is required')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'Field of Study is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      school,
      degree,
      from,
      to,
      current,
      fieldofstudy,
      description
    } = req.body;
    const newEdu = {
      school,
      degree,
      from,
      to,
      current,
      fieldofstudy,
      description
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return res.status(500).json({ msg: 'No profile for this user' });
      }
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (error) {
      res.status(500).json({ msg: 'Server error' });
    }
  }
);
router.delete('/profile/education/:edu_id', auth, async (req, res) => {
  const { edu_id } = req.params;
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(500).json({ msg: 'Education not found' });
    }
    const removeIndex = profile.education.map(item => item.id).indexOf(edu_id);
    if (removeIndex === -1) {
      return res.status(500).json({ msg: 'Education not found' });
    }
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Education not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});
module.exports = router;
