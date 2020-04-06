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
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectID,
    ref: 'User'
  }]
});

module.exports = mongoose.model('User', userSchema);
