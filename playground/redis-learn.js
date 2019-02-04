const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
// client.set('hi', 'there')
// client.get('hi', (err, value) => {
//     console.log(`Value is: ${value}`);
// })
// // client.get('hi', console.log);
// client.hset('bce', 'name', 'Muhammad Ali');
// // client.hset('bce', 'name', 'Yasir Abbas');
// client.hget('bce', 'name', (err, value) => console.log(`Value: ${value}`));
// client.hget('bce', 'name', console.log);
client.flushall();

// const redis = require("redis");
//     const redisUrl = "redis://127.0.0.1:6379";
//     const client = redis.createClient(redisUrl);
//     const util = require("util");
//     client.get = util.promisify(client.get);
//     // Do we have any cached data in redis related
//     // to this query
//     const cacheBlogs = await client.get(req.user.id);
//     // if yes, then request to the response right away
//     // and return
//     if (cacheBlogs) {
//       console.log('serving from cache....');
//       return res.send(JSON.parse(cacheBlogs));
//     }
//     // if no, then we need to respond to request
//     // and update our cache to store the data
// console.log('serving from mongodb...');
//     res.send(blogs);
//     client.set(req.user.id, JSON.stringify(blogs));