const redis = require('redis');
const config = require('./config');

const redisClient = redis.createClient({
    socket: {
        host: config.REDIS_HOST || "127.0.0.1",
        port: config.REDIS_PORT,
    }
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
    process.exit(1);
});



module.exports = redisClient;