const app = require('./app');

const port = process.env.API_PORT || process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
