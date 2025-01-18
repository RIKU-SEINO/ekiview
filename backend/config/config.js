console.log('config.js');
console.log("hostname: ", process.env.PG_HOST);
console.log("port: ", process.env.PG_PORT);
console.log("username: ", process.env.PG_USER);
console.log("database: ", process.env.PG_DB);
console.log("password: ", process.env.PG_PASSWORD);
console.log("url: ", process.env.PG_URL);

const host = process.env.PG_URL.split('@')[1].split('/')[0];

module.exports = {
  development: {
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB,
    host: process.env.PG_HOST,
    dialect: 'postgres',
    port: process.env.PG_PORT,
    timezone: process.env.TZ || 'Asia/Tokyo'
  },
  production: {
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB,
    host: process.env.PG_HOST || host,
    dialect: 'postgres',
    port: process.env.PG_PORT,
  },
  test: {
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB,
    host: process.env.PG_HOST,
    dialect: 'postgres',
    port: process.env.PG_PORT,
    timezone: process.env.TZ || 'Asia/Tokyo'
  },
};
