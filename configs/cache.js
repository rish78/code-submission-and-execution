const { createClient } = require('redis');

let redisClient;


(async () => {
    redisClient = createClient({
        socket: {
          host: 'localhost',
          port: 6379,
        }
      });
      
    redisClient.on('error', (err) => console.log('Redis Client Error', err));
    await redisClient.connect().catch(console.error);
})(); 


module.exports = redisClient;
