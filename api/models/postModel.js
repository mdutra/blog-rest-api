const { model, Schema } = require('mongoose');
const slugify = require('slugify');

const postSchema = new Schema({
  title: { type: String, required: true, unique: true },
  subtitle: String,
  published: { type: Date, default: Date.now },
  updated: Date,
  content: { type: String, required: true },
  authors: {
    type: [{ type: Schema.Types.ObjectId, ref: 'authors' }],
    validate: [a => a.length > 0, 'At least one author is required'],
  },
  comments: [{ type: Schema.Types.ObjectId, ref: 'comments' }],
  permalink: {
    type: String,
    unique: true,
    default: function genPermalink() {
      return slugify(this.title);
    },
    index: true,
  },
}, {
  versionKey: false,
});

module.exports = model('posts', postSchema);
