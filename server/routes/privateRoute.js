const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res) => {
  const token = req.header('auth-token');
  if (!token) return res.status(400).send('access denied');

  const { name, password } = jwt.verify(token, process.env.SECRET);
  User.findOne({ name, password });

  try {
    await req.user = jwt.verify(token, process.env.SECRET);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = auth;
