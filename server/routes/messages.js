const router = require('express').Router();

router.get('/getMessages', async (req, res) => {
  const { Message } = req.models;

  try {
    const messages = await Message.find();
    await res.status(200).send({ messages });
  } catch (error) {
    console.error(error);
    await res.status(400).send({ error });
  }
});

module.exports = router;
