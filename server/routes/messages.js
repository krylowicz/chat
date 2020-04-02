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
  const { User, Message, Conversation } = req.models;
  // const { user1ID, user2ID } = req.body;
  const user1ID = '5e7fd5b624077b271a751771';
  const user2ID = '5e81d785650aa84ad253ed02';

  const conversation = new Conversation({ users: [user1ID, user2ID] });

  try {
    await conversation.save();
    await res.status(200).send({ user1ID, user2ID });
  } catch (error) {
    await res.status(400).send(error);
    console.error(error);
  }
});

module.exports = router;
