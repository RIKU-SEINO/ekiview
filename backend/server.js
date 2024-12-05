const express = require('express');
const { query } = require('./config/db'); // db.js をインポート
const app = express();

app.get('/api', async (req, res) => {
  try {
    const result = await query('SELECT message FROM greetings LIMIT 1');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// サーバーをポート5000で開始
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
