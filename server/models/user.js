const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 6
  },
  password: {
    type: String,
    required: true,
    minLength: 8
  }
});

module.exports = mongoose.model('User', userSchema);

