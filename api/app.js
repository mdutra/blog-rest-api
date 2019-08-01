const config = require('config');
const debug = require('debug')('blog-api:server');
const express = require('express');
const mongoose = require('mongoose');

const authorRoutes = require('./routes/authorRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

// Mongoose connection
const mongoUrl = config.get('mongoUrl');

debug(`Connecting to ${mongoUrl}`);

mongoose.connect(mongoUrl, { useNewUrlParser: true })
  .catch(() => {
    console.error('Unable to connect to MongoDB');
  });

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/authors', authorRoutes);
app.use('/posts', postRoutes);

app.use((err, req, res, next) => {
  switch (err.name) {
    case 'ValidationError':
      res.status(422).send(err);
      break;
    case 'CastError':
      res.status(422).send(err);
      break;
    case 'NotFoundError':
      res.status(404).send(err);
      break;
    default:
      next(err);
  }
});

module.exports = app;
