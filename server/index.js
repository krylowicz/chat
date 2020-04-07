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
    if (!user) throw new Error('user or password are not valid');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('user or password are not valid');

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

  socket.on('getUserConversations', async(token, callback) => {
    let conversations;
    try {
      const user = await authorize(token);
      conversations = await Conversation.find({ users: { $in: [user._id] } }).populate('users');

      for (const conversation of conversations) {
        socket.join(conversation._id);
      }
    } catch (error) {
      console.error(error);
    }
    callback(conversations);
  });

  socket.on('sendMessage', async (token, conversationID, message, callback) => {
    try {
      const user = await authorize(token);
      const newMessage = new Message({ author: user._id, content: message });
      await newMessage.save();
      await Conversation.updateOne({ _id: conversationID }, { $push: { messages: newMessage } });

      io.to(conversationID).emit('newMessage', await Message.populate(newMessage, { path: 'author', select: 'name' }));
    } catch (error) {
      console.error(error);
    }
    callback();
  });

  socket.on('getConversationMessages', async (token, conversationID) => {
    try {
      await authorize(token);
      const { messages } = await Conversation.findOne({ _id: conversationID })
        // .sort('-date')
        // .limit(10)
        .populate({ path: 'messages', populate: { path: 'author', select: 'name' } });

      io.to(conversationID).emit('conversationMessages', messages.slice(-10));
    } catch (error) {
      console.error(error);
    }
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
