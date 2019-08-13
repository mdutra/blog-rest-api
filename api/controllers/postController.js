const {
  body, param, query, sanitizeBody,
} = require('express-validator');

const Post = require('../models/postModel');
const cache = require('../middlewares/cache');
const { responseHandler, throwValidationResults } = require('../middlewares/common');

const postController = {
  findAllPosts: [
    cache.get,

    query('limit').toInt(),
    query('offset').toInt(),

    (req, res, next) => {
      const { offset, limit } = req.query;

      Post.find({}, {}, {
        skip: offset,
        limit,
      })
        .then((posts) => {
          res.locals.data = posts;

          next();
        })
        .catch(next);
    },

    cache.set,

    responseHandler,
  ],
  findPostById: [
    cache.get,

    param('id').isMongoId(),

    throwValidationResults,

    (req, res, next) => {
      Post.findById(req.params.id)
        .then((post) => {
          if (!post) {
            const err = new Error('Blog post not found for the given ObjectId');
            err.name = 'NotFoundError';
            throw err;
          }

          res.locals.data = post;

          next();
        })
        .catch(next);
    },

    cache.set,

    responseHandler,
  ],
  findPostByPermalink: [
    cache.get,

    (req, res, next) => {
      Post.findOne({ permalink: req.params.permalink })
        .then((post) => {
          if (!post) {
            const err = new Error('Blog post not found for the given permalink');
            err.name = 'NotFoundError';
            throw err;
          }

          res.locals.data = post;

          next();
        })
        .catch(next);
    },

    cache.set,

    responseHandler,
  ],
  createPost: [
    body('title').isString().trim().isLength({ max: 500 }),
    body('subtitle').optional({ checkFalsy: true }).isString().trim()
      .isLength({ max: 500 }),
    body('content').isString(),
    body('authors').toArray().isLength({ min: 1 }),
    body('authors.*').isMongoId(),

    sanitizeBody('*').escape(),

    throwValidationResults,

    (req, res, next) => {
      delete req.body.permalink;

      Post.create(req.body)
        .then((post) => {
          res.locals.data = post;

          next();
        })
        .catch(next);
    },

    cache.clear,

    responseHandler,
  ],
  updatePost: [
    param('id').isMongoId(),

    body('title').optional({ checkFalsy: true }).isString().trim()
      .isLength({ max: 500 }),
    body('subtitle').optional({ checkFalsy: true }).isString().trim()
      .isLength({ max: 500 }),
    body('content').optional({ checkFalsy: true }).isString(),
    body('authors').optional({ checkFalsy: true }).toArray()
      .isLength({ min: 1 }),
    body('authors.*').isMongoId(),

    sanitizeBody('*').escape(),

    throwValidationResults,

    (req, res, next) => {
      const { id } = req.params;
      const replacement = req.body;
      const options = {
        new: true,
        useFindAndModify: false,
      };

      // Prevent fields from update
      delete replacement.published;
      delete replacement.permalink;

      replacement.updated = new Date();

      Post.findByIdAndUpdate(id, replacement, options)
        .then((post) => {
          if (!post) {
            const err = new Error('Blog post not found for the given ObjectId');
            err.name = 'NotFoundError';
            throw err;
          }

          res.locals.data = post;

          next();
        })
        .catch(next);
    },

    cache.clear,

    responseHandler,
  ],
  deletePost: [
    param('id').isMongoId(),

    throwValidationResults,

    (req, res, next) => {
      Post.findByIdAndDelete(req.params.id)
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

module.exports = postController;
