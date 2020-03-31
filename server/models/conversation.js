const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  users: {
    type: [mongoose.Schema.Types.ObjectID],
    ref: 'User'
  },
  messages: {
    type: [mongoose.Schema.Types.ObjectID],
    ref: 'Message'
  }
});

module.exports = mongoose.model('Conversation', conversationSchema);
