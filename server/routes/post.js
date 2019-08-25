const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Profile = require('../models/Profile');
const auth = require('../middleware');
const _ = require('lodash');
// const { check, validationResult } = require('express-validator');

router.get('/posts', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ date: -1 })
      .populate('user', ['name']);
    if (posts.length <= 0) {
      return res.status(400).send('No posts found');
    }
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send('Error finding posts');
  }
});
router.post(
  '/posts',auth,
  async (req, res) => {
    try {
      const { id } = req.user;
      const { text } = req.body;
      if(!text) return res.status(400).send('Text is required');

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
      await post.save();
      res.status(200).send(post);
    } catch (error) {
      res.status(500).send('Error creating post');
    }
  }
);
router.get('/posts/:post_id', auth, async (req, res) => {
  try {
    const { post_id } = req.params;
    let post = await Post.findOne({ _id: post_id }).populate('user', ['name']);
    if (!post) {
      return res.status(400).send('No post found');
    }
    res.status(200).send(post);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).send('No post found');
    }
    res.status(500).send('Error finding post');
  }
});
router.put('/posts/:post_id', auth, async (req, res) => {
  const { id } = req.user;
  const { text } = req.body;
  const { post_id } = req.params;
  try {
    if(!text)return res.status(400).send('Text is required');
    let post = await Post.findOne({
      _id: post_id,
      user: id
    }).populate('user', ['name']);
    if (!post) {
      return res.status(400).send('Unauthorized user');
    }
    _.update(post, (post.text = text));
    await post.save();
    res.status(200).send(post);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).send('No post found');
    }
    res.status(500).send('Error modifying post');
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
      return res.status(400).send('Unauthorized user');
    }
    res.status(200).send('Post removed');
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).send('No post found');
    }
    res.status(500).send('Error deleting post');
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
      return res.status(400).send("You've already liked this post");
    }

    post.likes.unshift({ user: id });

    await post.save();
    res.status(200).send(post.likes);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).send('No post found');
    }
    res.status(500).send('Error liking post');
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
      return res.status(400).send("You haven't liked this post");
    }

    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(id);

    post.likes.splice(removeIndex, 1);

    await post.save();
    res.status(200).send(post.likes);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).send('No post found');
    }
    res.status(500).send('Error unliking post');
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
    res.status(200).send(post.comments);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).send('No post found');
    }
    res.status(500).send('Error commenting on post');
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
      return res.status(400).send('No post found');
    }
    const comment = post.comments.find(comment => comment.id === comment_id);
    if (!comment) {
      return res.status(400).send('No comment found');
    }

    if (comment.user.toString() !== id) {
      return res.status(401).send('User not authorized');
    }

    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(id);
    post.comments.splice(removeIndex, 1);

    await post.save();
    res.status(200).send(post.comments);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).send('No comment found');
    }
    res.status(500).send('Error removing comment');
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
      return res.status(400).send('No post found');
    }
    const comment = post.comments.find(comment => comment.id === comment_id);
    if (!comment) {
      return res.status(400).send('No comment found');
    }

    if (comment.user.toString() !== id) {
      return res.status(401).send('User not authorized');
    }
    _.update(comment, (comment.text = text));
    await post.save();
    res.status(200).send(comment);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).send('No comment found');
    }
    res.status(500).send('Error modifying comment');
  }
});
module.exports = router;
