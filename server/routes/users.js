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

module.exports = router;
