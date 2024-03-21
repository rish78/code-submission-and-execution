const Redis = require("ioredis");
const redisUri = "rediss://default:AVNS_oqU1G-kTWaa0k2jEBBv@redis-2cb55bd3-rishabh02cv-8d12.a.aivencloud.com:12133"
const redisClient = new Redis(redisUri);

module.exports = redisClient;