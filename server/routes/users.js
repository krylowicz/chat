const router = require('express').Router();

router.get('/getUsers', async (req, res) => {
  if (!req.user) return res.status(400).send('user is not logged');
  const { User } = req.models;

  try {
    let users = await User.find();
    users = users.map(user => { return {
      _id: user._id,
      name: user.name,
      friends: user.friends.map(friend => { return {
        _id: friend._id,
        name: friend.name
      }})
    }});

    await res.status(200).send({ users: users.filter(user => user.name !== req.currentUser.name) })
  } catch (error) {
    console.error(error);
  }
});

router.get('/getFriends', async (req, res) => {
  if (!req.user) return res.status(400).send('user is not logged');
  const { User } = req.models;
  const { _id } = req.user;

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
    const { friends } = await User.findById(userID).select('friends');

    if (!friends.includes(friendID)) {
      await User.updateOne({ _id: userID }, { $push: { friends: friendID } });
      await User.updateOne({ _id: friendID }, { $push: { friends: userID } });
    }
    const { _id, name } = await User.findOne({ _id: userID });
    await res.status(200).send({ user: { _id, name } });
  } catch (error) {
    console.log(error);
  }
});

router.post('/removeFriend', async (req, res) => {
  const { User } = req.models;
  const { _id: userID } = req.user;
  const { friendID } = req.body;

  try {
    await User.updateOne({ _id: userID }, { $pull: { friends: friendID } });
    await User.updateOne({ _id: friendID }, { $pull: { friends: userID } });
    await res.status(200).send(`removed ${friendID}`);
  } catch (error) {
    res.status(400).send(error);
    console.error(error);
  }
});

module.exports = router;
