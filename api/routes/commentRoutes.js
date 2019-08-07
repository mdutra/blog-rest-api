const express = require('express');

const commentController = require('../controllers/commentController');

const router = express.Router();

router.route('/:id')
  .get(commentController.findCommentById)
  .delete(commentController.deleteComment);

module.exports = router;
