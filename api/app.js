const config = require('config');
const debug = require('debug')('blog-api:server');
const express = require('express');
const mongoose = require('mongoose');

const authorRoutes = require('./routes/authorRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

// Mongoose connection
const mongoUrl = config.get('mongoUrl');

debug(`Connecting to ${mongoUrl}`);

mongoose.connect(mongoUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
}).catch(() => {
  console.error('Unable to connect to MongoDB');
});

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/authors', authorRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

app.use((err, req, res, next) => {
  const formatError = ({ message, path, value }) => ({
    error: message,
    name: err.name,
    path,
    value,
  });

  switch (err.name) {
    case 'ValidationError':
      res.status(422).send(Object.values(err.errors)
        .map(val => formatError(val)));
      break;
    case 'CastError':
      res.status(422).send(formatError(err));
      break;
    case 'RequestValidationError':
      res.status(422).send(err.array());
      break;
    case 'NotFoundError':
      res.status(404).send(err);
      break;
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.name === 'MongoError' && err.code === 11000) {
    res.status(422).send({
      message: err.message,
      name: err.name,
    });
  } else {
    next(err);
  }
});

module.exports = app;
