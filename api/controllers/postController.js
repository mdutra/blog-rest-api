const { body, sanitizeBody } = require('express-validator');

const Post = require('../models/postModel');
const { throwValidationResults } = require('../utils/');

const postController = {
  findAllPosts(req, res, next) {
    Post.find()
      .then(res.json.bind(res))
      .catch(next);
  },
  findPostById(req, res, next) {
    Post.findById(req.params.id)
      .then((post) => {
        if (!post) {
          const err = new Error('Blog post not found for the given ObjectId');
          err.name = 'NotFoundError';
          throw err;
        }

        res.json(post);
      })
      .catch(next);
  },
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
      Post.create(req.body)
        .then(res.json.bind(res))
        .catch(next);
    },
  ],
  updatePost: [
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

      // Prevent field from update
      delete replacement.published;

      replacement.updated = new Date();

      Post.findByIdAndUpdate(id, replacement, options)
        .then((post) => {
          if (!post) {
            const err = new Error('Blog post not found for the given ObjectId');
            err.name = 'NotFoundError';
            throw err;
          }

          res.json(post);
        })
        .catch(next);
    },
  ],
  deletePost(req, res, next) {
    Post.findByIdAndDelete(req.params.id)
      .then(() => {
        res.status(204).json({});
      })
      .catch(next);
  },
};

module.exports = postController;
