const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');

dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose.connect(
  `${process.env.URI}`,
  { useNewUrlParser: true },
  () => console.log('connected to database')
);

app.use(express.json());
app.use('/api/auth', authRoute);

app.listen(PORT, () => console.log(`🚀 server is running on port: ${PORT}`));
