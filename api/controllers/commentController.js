const { body, param, sanitizeBody } = require('express-validator');

const Comment = require('../models/commentModel');
const { throwValidationResults } = require('../utils/');

const commentController = {
  findAllPostComments(req, res, next) {
    Comment.find()
      .then(res.json.bind(res))
      .catch(next);
  },
  findCommentById: [
    param('id').isMongoId(),

    throwValidationResults,

    (req, res, next) => {
      Comment.findById(req.params.id)
        .then((comment) => {
          if (!comment) {
            const err = new Error('Comment not found for the given ObjectId');
            err.name = 'NotFoundError';
            throw err;
          }

          res.json(comment);
        })
        .catch(next);
    },
  ],
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
  updateComment: [
    param('id').isMongoId(),

    body('content').isString().trim().isLength({ max: 500 }),

    sanitizeBody('*').escape(),

    throwValidationResults,

    (req, res, next) => {
      const { id } = req.params;
      const replacement = req.body;
      const options = {
        new: true,
        useFindAndModify: false,
      };

      // Prevent field from update
      delete replacement.published;
      delete replacement.user;

      Comment.findByIdAndUpdate(id, replacement, options)
        .then((comment) => {
          if (!comment) {
            const err = new Error('Comment not found for the given ObjectId');
            err.name = 'NotFoundError';
            throw err;
          }

          res.json(comment);
        })
        .catch(next);
    },
  ],
  deleteComment: [
    param('id').isMongoId(),

    throwValidationResults,

    (req, res, next) => {
      Comment.findByIdAndDelete(req.params.id)
        .then(() => {
          res.status(204).json({});
        })
        .catch(next);
    },
  ],
};

module.exports = commentController;
