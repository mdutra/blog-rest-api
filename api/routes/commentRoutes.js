const express = require('express');

const commentController = require('../controllers/commentController');

const router = express.Router();

router.route('/:id')
  .get(commentController.findCommentById)
  .put(commentController.updateComment)
  .delete(commentController.deleteComment);

module.exports = router;
