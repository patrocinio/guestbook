const queue = require ('./queue');
const QUEUE_NAME = "messages";
const MESSAGES_KEY = "messages";

const redisHelper = require('./redisHelper');
const MASTER_URL = "redis://redis-master";
const SLAVE_URL = "redis://redis-slave";

const master = redisHelper.connectToRedis(MASTER_URL);
const slave = redisHelper.connectToRedis(SLAVE_URL);

const {promisify} = require('util');

const setAsync = promisify(master.set).bind(master);
const getAsync = promisify(slave.get).bind(slave);
const lock = promisify(require("redis-lock") (master));

async function retrieveMessages () {
	console.log ("Retrieving messages ");

	const result = await getAsync(MESSAGES_KEY);

	console.log("Retrieve messages result: " + result);
	return result;
}

async function consume(channel, msg) {
		const message = msg.content.toString();
    const unlock = await lock (MESSAGES_KEY);

    let messages = await retrieveMessages();
		console.log ("==> Messages: ", messages);

    if (messages == "") {
      messages = message;
    } else {
      messages += "," + message;
    }
		console.log ("Setting messages to ", messages);

    const result = await setAsync(MESSAGES_KEY, messages);

    unlock();

		channel.ack(msg);

    console.log ("Result: " + result);
}

queue.createMQConnection(QUEUE_NAME, function (channel, queue) {
  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
  channel.consume(queue, function(msg) {
    console.log(" [x] Received %s", msg.content.toString());
    consume (channel, msg);
  }, {
      noAck: false
    });
});
