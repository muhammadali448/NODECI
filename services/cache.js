const mongoose = require("mongoose");
const redis = require("redis");
const keys = require('../config/keys');
const client = redis.createClient(keys.redisURL);
const util = require("util");
// client.get = util.promisify(client.get);
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) { 
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');
    return this;
 }

mongoose.Query.prototype.exec = async function() {
  //   console.log("I AM ABOUT TO RUN A QUERY");
  // console.log(this.getQuery());
  // console.log(this.mongooseCollection.name);
  if (!this.useCache) {
      return exec.apply(this, arguments);
  }
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    })
  );
  //   console.log(key);
//   const cacheValue = await client.get(key);
const cacheValue = await client.hget(this.hashKey, key);
  if (cacheValue) {
    // console.log(this);
    // const doc = new this.model(JSON.parse(cacheValue));
    // return doc;
    const doc = JSON.parse(cacheValue);
    return Array.isArray(doc)
      ? // its an array
        doc.map(d => new this.model(d))
      : // its an object
        new this.model(doc);
  }
  const result = await exec.apply(this, arguments);
  //   console.log('Result (cache.js)', result);
//   client.set(key, JSON.stringify(result), 'EX', 10);
client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10);
  return result;
};

module.exports = { 
    clearHash(key) {
        client.del(JSON.stringify(key));
    }
 }
