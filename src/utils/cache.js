const getRedisClient = require('../config/redis');

const cache = {
    async get(key) {
        try {
            const val = await getRedisClient().get(key);
            return val ? JSON.parse(val) : null;
        } catch { return null; }   // cache miss on any error — never throws
    },

    async set(key, value, ttlSeconds = 60) {
        try {
            await getRedisClient().setex(key, ttlSeconds, JSON.stringify(value));
        } catch { /* non-fatal */ }
    },

    async del(key) {
        try { await getRedisClient().del(key); }
        catch { /* non-fatal */ }
    },
};
module.exports = cache;
