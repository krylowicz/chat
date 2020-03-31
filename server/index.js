const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { pingTimeout: 60000 });
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes/router');
const authRoute = require('./routes/auth');
const Message = require('./models/message');

dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose.connect(
  `${process.env.URI}`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('connected to database')
);

io.on('connect', socket => {
  console.log('connected sockets', socket.id);

  socket.on('sendMessage', (name, message, callback) => {
    console.log(`message: ${message}`);
    // new Message({ _id:  author: name, content: message })

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
app.use(router);
app.use('/api/auth', authRoute);

server.listen(PORT, () => console.log(`🚀 server is running on http://localhost:${PORT}`));
