const jwt = require('jsonwebtoken');
const router = require('express').Router();

router.get('/getUsers', async (req, res) => {
  const { User } = req.models;

  try {
    let users = await User.find();
    users = users.map(user => { return {
      _id: user._id,
      name: user.name,
      friends: user.friends.map(friend => { return {
        _id: friend.name,
        name: friend.name
      }})
    }});

    await res.status(200).send({ users })
  } catch (error) {
    console.error(error);
  }
});

router.get('/getFriends', async (req, res) => {
  const { User } = req.models;

  const token = req.header('authToken');
  if (!token) return res.status(400).send('Invalid token');

  const { _id } = await jwt.verify(token, process.env.SECRET);

  try {
    res.status(200).send(await User.findById(_id).select('friends'));
  } catch (error) {
    console.log(error);
  }
});

router.post('/addFriend', async (req, res) => {
  const { User } = req.models;
  const { userID, friendID } = req.body;

  try {
    await User.updateOne({ _id: userID }, { $push: { friends: friendID }});
    await User.updateOne({ _id: friendID }, { $push: { friends: userID }});
    await res.status(200).send(await User.findOne({ _id: userID }));
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
