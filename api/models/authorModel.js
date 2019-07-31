const { model, Schema } = require('mongoose');

const authorSchema = new Schema({});

module.exports = model('authors', authorSchema);
