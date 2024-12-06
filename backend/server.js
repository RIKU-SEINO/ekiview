require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/api/greet', async (req, res) => {
  res.json({ message: 'Hello world, Backend!' });
});

app.get('/api/db', testConnection);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
