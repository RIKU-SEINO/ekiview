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
  res.send('Hello World, Backend!');
});

// サーバーをポート5000で開始
// ポート番号を環境変数から取得する
// ポート番号は、ルートディレクトリの.env ファイルに記述してある
const PORT = process.env.BACKEND_PORT;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

