const app = require('./app');

app.listen(process.env.API_PORT, () => {
  console.log(`Server is running !`);
});
