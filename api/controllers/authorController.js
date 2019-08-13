const {
  body, param, query, sanitizeBody,
} = require('express-validator');

const Author = require('../models/authorModel');
const { responseHandler, throwValidationResults } = require('../middlewares/common');
const cache = require('../middlewares/cache');

const authorController = {
  findAllAuthors: [
    cache.get,

    query('limit').toInt(),
    query('offset').toInt(),

    (req, res, next) => {
      Author.find({}, {}, {
        skip: req.query.offset,
        limit: req.query.limit,
      })
        .then((authors) => {
          res.locals.data = authors;

          next();
        })
        .catch(next);
    },

    cache.set,

    responseHandler,
  ],
  findAuthorById: [
    cache.get,

    param('id').isMongoId(),

    throwValidationResults,

    (req, res, next) => {
      Author.findById(req.params.id)
        .then((author) => {
          if (!author) {
            const err = new Error('Author not found for the given ObjectId');
            err.name = 'NotFoundError';
            throw err;
          }

          res.locals.data = author;

          next();
        })
        .catch(next);
    },

    cache.set,

    responseHandler,
  ],
  createAuthor: [
    body('firstName').isString().trim().isLength({ max: 100 }),
    body('lastName').isString().trim().isLength({ max: 100 }),

    sanitizeBody('*').escape(),

    throwValidationResults,

    (req, res, next) => {
      Author.create(req.body)
        .then((author) => {
          res.locals.data = author;

          next();
        })
        .catch(next);
    },

    cache.clear,

    responseHandler,
  ],
  updateAuthor: [
    param('id').isMongoId(),

    body('firstName').optional({ checkFalsy: true }).isString().trim()
      .isLength({ max: 100 }),
    body('lastName').optional({ checkFalsy: true }).isString().trim()
      .isLength({ max: 100 }),

    sanitizeBody('*').escape(),

    throwValidationResults,

    (req, res, next) => {
      const { id } = req.params;
      const replacement = req.body;
      const options = {
        new: true,
        useFindAndModify: false,
      };

      Author.findByIdAndUpdate(id, replacement, options)
        .then((author) => {
          if (!author) {
            const err = new Error('Author not found for the given ObjectId');
            err.name = 'NotFoundError';
            throw err;
          }

          res.locals.data = author;

          next();
        })
        .catch(next);
    },

    cache.clear,

    responseHandler,
  ],
  deleteAuthor: [
    param('id').isMongoId(),

    throwValidationResults,

    (req, res, next) => {
      Author.deleteOne({ _id: req.params.id })
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

module.exports = authorController;
