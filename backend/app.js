const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Qrcode } = require('./models');
const qrcodeRoutes = require('./routes/qrcodeRoutes');
const placeSearchRoutes = require('./routes/placeSearchRoutes');
const routeSearchRoutes = require('./routes/routeSearchRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', qrcodeRoutes);
app.use('/api', placeSearchRoutes);
app.use('/api/route', routeSearchRoutes);

app.get('/api/greet', async (req, res) => {
  res.json({ message: 'Hello world, Backend!' });
});

app.get('/api/qrcodes', async (req, res) => {
  try {
    const qrcodes = await Qrcode.findAll();
    res.json(qrcodes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

module.exports = app;
