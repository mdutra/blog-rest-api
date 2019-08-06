const { model, Schema } = require('mongoose');

const commentSchema = new Schema({
  content: { type: String, required: true },
  published: { type: Date, default: Date.now },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'users',
  },
}, {
  versionKey: false,
});

module.exports = model('comments', commentSchema);
