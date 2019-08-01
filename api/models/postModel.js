const { model, Schema } = require('mongoose');

const commentSchema = new Schema({
  content: { type: String, required: true },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'users',
  },
});

const postSchema = new Schema({
  title: { type: String, required: true },
  subtitle: String,
  published: { type: Date, default: Date.now },
  updated: Date,
  content: { type: String, required: true },
  authors: {
    type: [{ type: Schema.Types.ObjectId, ref: 'authors' }],
    validate: [a => a.length > 0, 'At least one author is required'],
  },
  comments: [commentSchema],
});

module.exports = model('posts', postSchema);
