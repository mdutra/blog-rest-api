const { model, Schema } = require('mongoose');

const authorSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

module.exports = model('authors', authorSchema);
