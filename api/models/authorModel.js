const { model, Schema } = require('mongoose');

const authorSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
}, {
  versionKey: false,
});

module.exports = model('authors', authorSchema);
