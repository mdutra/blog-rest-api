const { validationResult } = require('express-validator');

const utils = {
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
      err.name = 'ExpressValidationError';
      next(err);
    }
  },
};

module.exports = utils;
