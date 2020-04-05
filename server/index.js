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

io.on('connect', async socket => {
  const authorize = async token => {
    const { name, password } = await jwt.verify(token, process.env.SECRET);

    const user = await User.findOne({ name });
    if (!user) throw new Error;

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error;

    return { _id: user._id, name: user.name, friends: user.friends };
  };

  socket.on('addFriend', async (token, friendID, callback) => {
    try {
      const user = await authorize(token);
      const { friends } = await User.findById(user._id).select('friends');
      const conversation = await Conversation.find({ users: [user._id, friendID] });

      if (!friends.includes(friendID)) {
        await User.updateOne({ _id: user._id }, { $push: { friends: friendID } });
        await User.updateOne({ _id: friendID }, { $push: { friends: user._id } });
      }

      if (conversation.length === 0) {
        const newConversation = new Conversation({ users: [user._id, friendID] });
        await newConversation.save();
      }
      callback((await User.findById(user._id).select('friends')).friends);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('removeFriend', async (token, friendID, callback) => {
    try {
      const user = await authorize(token);
      await User.updateOne({ _id: user._id }, { $pull: { friends: friendID } });
      await User.updateOne({ _id: friendID }, { $pull: { friends: user._id } });
      callback((await User.findById(user._id).select('friends')).friends)
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('getUserConversations', async(token) => {
    try {
      const user = await authorize(token);
      const conversation = await Conversation.find({ users: { $in: [user._id] } });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('getConversationMessages', async (token, userID, callback) => {
    let conversation;
    try {
      const user = await authorize(token);
      conversation = await Conversation.find({ users: { $in: [user._id, userID] } });
    } catch (error) {
      console.error(error);
    }
    callback(conversation[0].messages);
  });

  socket.on('sendMessage', async (token, userID, message, callback) => {
    try {
      const user = await authorize(token);
      const newMessage = new Message({ author: user._id, content: message });
      const conversation = await Conversation.find({ users: { $in: [user._id, userID] } });
      await conversation[0].updateOne({ $push: { messages: newMessage } });
    } catch (error) {
      console.log(error);
    }
    callback();
  });

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
