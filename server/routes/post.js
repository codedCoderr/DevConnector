const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Profile = require('../models/Profile');
const auth = require('../middleware');
const _ = require('lodash');
const { check, validationResult } = require('express-validator');

router.get('/posts', auth, async (req, res) => {
  try {
    const posts = await Post.find().populate('user', ['name']);
    if (posts.length <= 0) {
      return res.status(400).json({ msg: 'No posts found' });
    }
    res.json(posts);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});
router.post(
  '/posts',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { id } = req.user;
      const { text } = req.body;
      let profile = await Profile.findOne({ user: id });
      if (!profile) {
        profile = {};
      }
      let post = await Post.find().populate('user', ['name']);

      post = new Post({
        text,
        user: id,
        avatar: profile.avatar
      });
      post.save();
      res.json(post);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);
router.get('/posts/:post_id', auth, async (req, res) => {
  try {
    const { post_id } = req.params;
    let post = await Post.findOne({ _id: post_id }).populate('user', ['name']);
    if (!post) {
      return res.status(400).json({ msg: 'No post found' });
    }
    res.json(post);
  } catch (error) {
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'No post found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});
router.put('/posts/:post_id', auth, async (req, res) => {
  const { id } = req.user;
  const { text } = req.body;
  const { post_id } = req.params;
  try {
    let post = await Post.findOne({
      _id: post_id,
      user: id
    }).populate('user', ['name']);
    if (!post) {
      return res.status(400).json({ msg: 'Unauthorized user' });
    }
    _.update(post, (post.text = text));
    await post.save();
    res.json(post);
  } catch (error) {
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'No post found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});
router.delete('/posts/:post_id', auth, async (req, res) => {
  const { id } = req.user;
  const { post_id } = req.params;
  try {
    let post = await Post.findOneAndRemove({
      _id: post_id,
      user: id
    });
    if (!post) {
      return res.status(400).json({ msg: 'No post found' });
    }
    res.json({ msg: 'Post removed' });
  } catch (error) {
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'No post found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});
router.post('/posts/:post_id/like', auth, async (req, res) => {
  const { post_id } = req.params;
  const { id } = req.user;
  try {
    let post = await Post.findOne({
      _id: post_id
    });
    if (post.likes.filter(like => like.user.toString() === id).length > 0) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: id });

    await post.save();
    res.json(post.likes);
  } catch (error) {
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'No post found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});
router.post('/posts/:post_id/unlike', auth, async (req, res) => {
  const { post_id } = req.params;
  const { id } = req.user;
  try {
    let post = await Post.findOne({
      _id: post_id
    });
    if (post.likes.filter(like => like.user.toString() === id).length <= 0) {
      return res.status(400).json({ msg: "Post hasn't yet been liked" });
    }

    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(id);

    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (error) {
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'No post found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});
router.post('/posts/:post_id/comment', auth, async (req, res) => {
  const { post_id } = req.params;
  const { id } = req.user;
  const { text } = req.body;
  try {
    let profile = await Profile.findOne({
      user: id
    });
    if (!profile) {
      profile = {};
    }
    let post = await Post.findOne({
      _id: post_id
    });

    let user = await User.findOne({
      _id: id
    });
    const newComment = {
      text,
      name: user.name,
      avatar: profile.avatar,
      user: id
    };
    post.comments.unshift(newComment);

    await post.save();
    res.json(post.comments);
  } catch (error) {
    console.log(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'No post found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});
router.delete('/posts/:post_id/comment/:comment_id', auth, async (req, res) => {
  const { post_id, comment_id } = req.params;
  const { id } = req.user;
  try {
    let post = await Post.findOne({
      _id: post_id
    });
    if (!post) {
      return res.status(404).json({ msg: 'No post found' });
    }
    const comment = post.comments.find(comment => comment.id === comment_id);
    if (!comment) {
      return res.status(404).json({ msg: 'No comment found' });
    }

    if (comment.user.toString() !== id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(id);
    post.comments.splice(removeIndex, 1);

    await post.save();
    res.json(post.comments);
  } catch (error) {
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Error removing comment' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});
router.put('/posts/:post_id/comment/:comment_id', auth, async (req, res) => {
  const { post_id, comment_id } = req.params;
  const { id } = req.user;
  const { text } = req.body;
  try {
    let post = await Post.findOne({
      _id: post_id
    });
    if (!post) {
      return res.status(404).json({ msg: 'No post found' });
    }
    const comment = post.comments.find(comment => comment.id === comment_id);
    if (!comment) {
      return res.status(404).json({ msg: 'No comment found' });
    }
    _.update(comment, (comment.text = text));

    if (comment.user.toString() !== id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await post.save();
    res.json(comment);
  } catch (error) {
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Error modifying comment' });
    }
    console.log(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});
module.exports = router;
