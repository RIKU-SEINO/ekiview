require('dotenv').config({ path: '../.env' });
const redis = require('redis');
const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
  legacyMode: true
});

client.connect().catch(console.error);

client.on('error', (err) => {
  console.error('Redis error:', err);
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

const cacheService = {
  get: (key) => {
    return new Promise((resolve, reject) => {
      client.get(key, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  },
  set: (key, value) => {
    return new Promise((resolve, reject) => {
      client.set(key, value, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
};

module.exports = cacheService;