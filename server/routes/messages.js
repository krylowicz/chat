const router = require('express').Router();

router.get('/getMessages', async (req, res) => {
  const { Message } = req.models;

  try {
    const messages = await Message.find();
    await res.status(200).send({ messages });
  } catch (error) {
    console.error(error);
  }
});

router.post('/createConversation', async (req, res) => {
  const { Conversation } = req.models;
  const { currentUserID, userID } = req.body;

  const conversation = new Conversation({ users: [currentUserID, userID] });

  try {
    await conversation.save();
    await res.status(200).send({ currentUserID, userID });
  } catch (error) {
    await res.status(400).send(error);
    console.error(error);
  }
});

router.get('/getConversation', async (req, res) => {
  const { Conversation } = req.models;
  const { currentUserID, userID } = req.body;

  try {
    const conversation = Conversation.find({ users: [currentUserID, userID] });
    await res.status(200).send(conversation);
  } catch (error) {
    await res.status(400).send(error);
    console.error(error);
  }
});

module.exports = router;
