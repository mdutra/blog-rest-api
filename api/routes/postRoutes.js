const express = require('express');

const postController = require('../controllers/postController');

const router = express.Router();

router.route('/')
  .get(postController.findAllPosts)
  .post(postController.createPost);

router.route('/:id')
  .get(postController.findPostById)
  .delete(postController.deletePost);

module.exports = router;
