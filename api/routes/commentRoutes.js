const express = require('express');

const commentController = require('../controllers/commentController');

const router = express.Router();

router.route('/:id')
  .get(commentController.findCommentById);

module.exports = router;
