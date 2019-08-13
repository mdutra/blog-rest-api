const { validationResult } = require('express-validator');

const common = {
  responseHandler(req, res, next) {
    if (res.locals.data) {
      res.json(res.locals.data);
    } else {
      const err = new Error('Missing response data');

      next(err);
    }
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

module.exports = common;
