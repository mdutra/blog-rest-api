const { body, sanitizeBody } = require('express-validator');

const Author = require('../models/authorModel');
const { throwValidationResults } = require('../utils/');

const authorController = {
  findAllAuthors(req, res, next) {
    Author.find()
      .then(res.json.bind(res))
      .catch(next);
  },
  findAuthorById(req, res, next) {
    Author.findById(req.params.id)
      .then((author) => {
        if (!author) {
          const err = new Error('Author not found for the given ObjectId');
          err.name = 'NotFoundError';
          throw err;
        }

        res.json(author);
      })
      .catch(next);
  },
  createAuthor: [
    body('firstName').isString().trim().isLength({ max: 100 }),
    body('lastName').isString().trim().isLength({ max: 100 }),

    sanitizeBody('*').escape(),

    throwValidationResults,

    (req, res, next) => {
      Author.create(req.body)
        .then(res.json.bind(res))
        .catch(next);
    },
  ],
  updateAuthor: [
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

          res.json(author);
        })
        .catch(next);
    },
  ],
  deleteAuthor(req, res, next) {
    Author.deleteOne({ _id: req.params.id })
      .then(() => {
        res.status(204).json({});
      })
      .catch(next);
  },
};

module.exports = authorController;
