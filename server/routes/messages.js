const router = require('express').Router();
const Message = require('../models/message');
const Conversation = require('../models/conversation');

router.get('/getMessages', (req, res) => {
  res.send('get messages');
});

module.exports = router;
