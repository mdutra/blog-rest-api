const { model, Schema } = require('mongoose');

const userSchema = new Schema({});

module.exports = model('users', userSchema);
