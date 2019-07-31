const { model, Schema } = require('mongoose');

const postSchema = new Schema({});

module.exports = model('posts', postSchema);
