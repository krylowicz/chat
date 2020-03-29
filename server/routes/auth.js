const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authValidation = require('../validation');

router.post('/register', async (req, res) => {
  const { name, password } = req.body;

  const { error } = authValidation(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  const nameExist = await User.findOne({ name });
  if (nameExist) return res.status(400).send('name is arleady in use');

  const salt = await bcrypt.genSalt(10);
  const hashedPasword = await bcrypt.hash(password, salt);

  const user = new User({ name, password: hashedPasword });

  const token = jwt.sign({ _id: user._id, name, password }, process.env.SECRET);

  try {
    await user.save();
    await res.header('authToken', token).send({ token, user: { name } });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/login', async (req, res) => {
  const { name, password } = req.body;

  const { error } = authValidation(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  const user = await User.findOne({ name });
  if (!user) return res.status(400).send('invalid name or password');

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send('invalid name or password');

  const token = jwt.sign({ _id: user._id, name, password }, process.env.SECRET);

  try {
    await res.header('authToken', token).send({ token, user: { name } });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
