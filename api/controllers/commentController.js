const {
  body, param, query, sanitizeBody,
} = require('express-validator');

const cache = require('../middlewares/cache');
const Comment = require('../models/commentModel');
const Post = require('../models/postModel');
const { responseHandler, throwValidationResults } = require('../middlewares/common');

const commentController = {
  findAllPostComments: [
    cache.get,

    param('id').isMongoId(),

    query('offset').toInt(),
    query('limit').toInt(),

    throwValidationResults,

    (req, res, next) => {
      Post.findById(req.params.id)
        .populate({ path: 'comments', model: Comment })
        .then((post) => {
          if (!post) {
            const err = new Error('Blog post not found for the given ObjectId');
            err.name = 'NotFoundError';
            throw err;
          }

          // Filter comments with query in "q"
          const comments = req.query.q
            ? post.comments.filter(({ content }) => content.includes(req.query.q))
            : post.comments;

          // Pagination
          const offset = req.query.offset || 0;
          const { limit } = req.query;

          // Use an array because the second arg should be set only if it's not zero
          const sliceArgs = [offset];

          if (limit) {
            sliceArgs.push(offset + limit);
          }

          res.locals.data = comments.slice(...sliceArgs);

          next();
        })
        .catch(next);
    },

    cache.set,

    responseHandler,
  ],
  findCommentById: [
    cache.get,

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

          res.locals.data = comment;

          next();
        })
        .catch(next);
    },

    cache.set,

    responseHandler,
  ],
  createComment: [
    param('id').isMongoId(),

    body('content').isString().trim().isLength({ max: 500 }),
    body('user').isMongoId(),

    sanitizeBody('*').escape(),

    throwValidationResults,

    (req, res, next) => {
      Post.findById(req.params.id)
        .then((post) => {
          if (!post) {
            const err = new Error('Blog post not found for the given ObjectId');
            err.name = 'NotFoundError';
            throw err;
          }

          // Create document first to use the ID
          const comment = new Comment(req.body);

          return Promise.all([
            comment.save(),
            post.updateOne({ $push: { comments: comment.id } }),
          ]);
        })
        .then((response) => {
          // Respond with saved comment
          [res.locals.data] = response;

          next();
        })
        .catch(next);
    },

    cache.clear,

    responseHandler,
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

          res.locals.data = comment;

          next();
        })
        .catch(next);
    },

    cache.clear,

    responseHandler,
  ],
  deleteComment: [
    param('id').isMongoId(),

    throwValidationResults,

    (req, res, next) => {
      Comment.findByIdAndDelete(req.params.id)
        .then(() => {
          res.status(204);
          res.locals.data = {};

          next();
        })
        .catch(next);
    },

    cache.clear,

    responseHandler,
  ],
};

module.exports = commentController;
