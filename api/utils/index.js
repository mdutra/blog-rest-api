const { validationResult } = require('express-validator');

const utils = {
  responseHandler(req, res) {
    res.json(res.locals.data);
  },
  throwValidationResults(req, res, next) {
    try {
      validationResult(req)
        .formatWith(({ msg, param, value }) => ({
          error: msg,
          name: 'ValidationError',
          path: param,
          value,
        }))
        .throw();
      next();
    } catch (err) {
      err.name = 'RequestValidationError';
      next(err);
    }
  },
};

module.exports = utils;
