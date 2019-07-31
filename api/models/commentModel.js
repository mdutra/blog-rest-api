const { model, Schema } = require('mongoose');

const commentSchema = new Schema({});

module.exports = model('comments', commentSchema);
