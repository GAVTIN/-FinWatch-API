const Redis = require('ioredis');
const config = require('./env');

let client;

const getRedisClient = () => {
    if (client) return client;

    client = new Redis({
        host: config.redisHost || 'localhost',
        port: parseInt(config.redisPort) || 6379,
        password: config.redisPassword || undefined,
        retryStrategy: (times) => {
            if (times > 3) {
                console.warn('Redis unavailable — running without cache');
                return null;   // stop retrying, app continues without cache
            }
            return Math.min(times * 200, 2000);
        },
        lazyConnect: true,
    });

    client.on('connect', () => console.log('Redis connected'));
    client.on('error', (err) => console.warn('Redis error:', err.message));

    client.connect().catch(() => { });   // non-fatal
    return client;
};

module.exports = getRedisClient;
