const router = require('express').Router();

router.get('/getUsers', async (req, res) => {
  if (!req.user) return res.status(400).send('user is not logged');
  const { User } = req.models;
  // const { _id } = req.currentUser;
  const { name } = req.currentUser;

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

    // const currentUser = users.find(user => user._id === _id));
    const currentUser = users.find(user => user.name === name);
    let index;
    for (let i = 0; i < users.length; i++) {
      if (users[i] === currentUser) index = i;
    }
    users.splice(index, 1);

    await res.status(200).send({ users })
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

module.exports = router;
