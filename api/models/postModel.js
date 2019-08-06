const { model, Schema } = require('mongoose');

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
  comments: [{ type: Schema.Types.ObjectId, ref: 'comments' }],
}, {
  versionKey: false,
});

module.exports = model('posts', postSchema);
