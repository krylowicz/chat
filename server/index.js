const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const router = require('./routes/router');
const cors = require('cors');
const authRoute = require('./routes/auth');

dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose.connect(
  `${process.env.URI}`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('connected to database')
);

io.on('connect', socket => {
  console.log('connected sockets', socket.id);

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
