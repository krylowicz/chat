const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { pingTimeout: 60000 });
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const Message = require('./models/message');
const Conversation = require('./models/conversation');
const router = require('./routes/router');
const authRoute = require('./routes/auth');
const messagesRoute = require('./routes/messages');
const usersRoute = require('./routes/users');

dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose.connect(
  `${process.env.URI}`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('connected to database')
);

io.on('connect', socket => {
  console.log('connected sockets', socket.id);

  // socket.on('sendMessage', async (_id, message, callback) => {
  //   try {
  //     const newMessage = new Message({ author: _id, content: message });
  //     await newMessage.save();
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   callback();
  // });

  socket.on('disconnect', () => {
    console.log('user has left');
  })
});

app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.use(async (req, res, next) => {
  req.models = { User, Message, Conversation };

  req.token = req.header('authToken');
  if (req.token) {
    const { name, password } = await jwt.verify(req.token, process.env.SECRET);

    const user = await User.findOne({ name });
    if (!user) return res.status(400).send('invalid name or password');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('invalid name or password');

    req.currentUser = user;
    req.user = { _id: user._id, name: user.name, friends: user.friends };
  }
  next();
});
app.use(router);
app.use('/api/auth', authRoute);
app.use('/api/messages', messagesRoute);
app.use('/api/users', usersRoute);

server.listen(PORT, () => console.log(`🚀 server is running on http://localhost:${PORT}`));
