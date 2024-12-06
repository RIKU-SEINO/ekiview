const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const testConnection = async (req, res) => {
  try {
    const client = await pool.connect();
    res.json({ message: 'Database connection successful' });
    client.release();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
};

module.exports = { testConnection };