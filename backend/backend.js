const request = require('request')
const redisHelper = require('./redisHelper');
const REDIS_URL = "redis://redis-master";
const KEY = "messages";

const client = redisHelper.connectToRedis(REDIS_URL);

function get (req, res) {
  console.log ("Backend.get")

  client.get(KEY, function(err, reply) {
      // reply is null when the key is missing
      console.log("Result: " + reply);
      res.send (reply)
  });

}

function append (req, res) {
  console.log ("Backend.append")
  res.send ("Append")
}

module.exports = {
  get,
  append
}
