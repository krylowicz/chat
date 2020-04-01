const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectID,
    ref: 'User'
  },
  content: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  conversationID: {
    type: Number
  }
});

module.exports = mongoose.model('Message', messageSchema);
