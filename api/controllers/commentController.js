const { body, sanitizeBody } = require('express-validator');

const Comment = require('../models/commentModel');
const { throwValidationResults } = require('../utils/');

const commentController = {
  findAllPostComments(req, res, next) {
    Comment.find()
      .then(res.json.bind(res))
      .catch(next);
  },
  createComment: [
    body('content').isString().trim().isLength({ max: 500 }),
    body('user').isMongoId(),

    sanitizeBody('*').escape(),

    throwValidationResults,

    (req, res, next) => {
      Comment.create(req.body)
        .then(res.json.bind(res))
        .catch(next);
    },
  ],
};

module.exports = commentController;
