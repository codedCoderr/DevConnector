const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const User = require('../models/User');
const auth = require('../middleware');
const request = require('request');
const { check, validationResult } = require('express-validator');

router.get('/profile/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name']
    );
    if (!profile) {
      return res.status(200).send('No profile for this user');
    }
    res.status(200).send(profile);
  } catch (error) {
    res.status(500).send({ errors: [{ msg: 'Error getting profile' }] });
  }
});
router.post('/profile', auth, async (req, res) => {
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

  if (!status) res.status(400).send('Status is required');
  if (!skills) res.status(400).send('Skills is required');
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
      return res.status(200).send(profile);
    }
    profile = await new Profile(profileFields).populate('user', ['name']);
    await profile.save();
    res.status(200).send(profile);
  } catch (error) {
    res.status(500).send('Error creating profile');
  }
});

router.get('/profile', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name']);
    if (profiles.length <= 0) {
      return res
        .status(400)
        .send('There are currently no profiles,be the first to add one');
    }
    res.status(200).send(profiles);
  } catch (error) {
    res.status(500).send('Error getting profiles');
  }
});

router.get('/profile/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name']);
    if (!profile) {
      return res.status(400).send('Profile not found');
    }
    res.status(200).send(profile);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).send('Profile not found');
    }
    res.status(500).send('Error getting profile');
  }
});
router.delete('/profile', auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.status(200).send('User deleted');
  } catch (error) {
    res.status(500).send('Error getting profile');
  }
});
router.post('/profile/experience', auth, async (req, res) => {
  const { title, company, from, to, current, location, description } = req.body;
  if (!title) res.status(400).send('Title is required');
  if (!company) res.status(400).send('Company is required');
  if (!from) res.status(400).send('From date is required');
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
      return res.status(400).send('No profile for this user');
    }
    profile.experience.unshift(newExp);
    await profile.save();
    res.status(200).send(profile);
  } catch (error) {
    res.status(500).send('Error creating experience');
  }
});
router.delete('/profile/experience/:exp_id', auth, async (req, res) => {
  const { exp_id } = req.params;
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    });
    if (!profile) {
      return res.status(400).send('Experience not found');
    }
    const removeIndex = profile.experience.map(item => item.id).indexOf(exp_id);
    if (removeIndex === -1) {
      return res.status(400).send('Experience not found');
    }
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.status(200).send(profile);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).send('Experience not found');
    }
    res.status(500).send('Error deleting experience');
  }
});
router.post('/profile/education', auth, async (req, res) => {
  if (!school) res.status(400).send('School is required');
  if (!degree) res.status(400).send('Degree is required');
  if (!fieldofstudy) res.status(400).send('Field of study is required');
  if (!from) res.status(400).send('From date is required');
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
      return res.status(400).send('No profile for this user');
    }
    profile.education.unshift(newEdu);
    await profile.save();
    res.status(200).send(profile);
  } catch (error) {
    res.status(500).send('Error creating education');
  }
});
router.delete('/profile/education/:edu_id', auth, async (req, res) => {
  const { edu_id } = req.params;
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(400).send('Education not found');
    }
    const removeIndex = profile.education.map(item => item.id).indexOf(edu_id);
    if (removeIndex === -1) {
      return res.status(400).send('Education not found');
    }
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.status(200).send(profile);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).send('Education not found');
    }
    res.status(500).send('Error deleting education');
  }
});

router.get('/profile/github/:username', async (req, res) => {
  const { githubClientId, githubSecret } = process.env;
  const { username } = req.params;
  try {
    const options = {
      uri: `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${githubClientId}&client_secret=${githubSecret}`,
      method: 'GET',
      headers: {
        'user-agent': 'node.js'
      }
    };
    request(options, (error, response, body) => {
      if (error) console.log(error);
      if (response.statusCode !== 200) {
        return res.status(400).send('No Github profile found');
      }
      res.status(200).send(send.parse(body));
    });
  } catch (error) {
    res.status(500).send('Error getting github repos');
  }
});

module.exports = router;
