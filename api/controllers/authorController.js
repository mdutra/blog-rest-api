const Author = require('../models/authorModel');

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
  createAuthor(req, res, next) {
    Author.create(req.body)
      .then(res.json.bind(res))
      .catch(next);
  },
  updateAuthor(req, res, next) {
    const filter = { _id: req.params.id };
    const replacement = req.body;
    const options = { new: true };

    Author.findOneAndUpdate(filter, replacement, options)
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
};

module.exports = authorController;
