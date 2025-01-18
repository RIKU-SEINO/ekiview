module.exports = {
  development: {
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB,
    dialect: 'postgres',
    timezone: process.env.TZ || 'Asia/Tokyo'
  },
  production: {
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB,
    dialect: 'postgres',
    timezone: process.env.TZ || 'Asia/Tokyo'
  },
  test: {
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB,
    dialect: 'postgres',
    timezone: process.env.TZ || 'Asia/Tokyo'
  },
};
