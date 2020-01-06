const queue = require ('./queue');
const QUEUE_NAME = "messages";
const MESSAGES_KEY = "messages";
const MESSAGES_LOCK = "messages-lock";

const redisHelper = require('./redisHelper');
const MASTER_URL = "redis://redis-master";
const SLAVE_URL = "redis://redis-slave";

const NUM_REPLICAS = 3;

const {promisify} = require('util');

async function retrieveMessages () {
	console.log ("Retrieving messages ");

	const slave = redisHelper.connectToRedis(SLAVE_URL);
	const getAsync = promisify(slave.get).bind(slave);

	const result = await getAsync(MESSAGES_KEY);

	console.log("Retrieve messages result: " + result);
	return result;
}

async function consume(channel, msg) {
		const message = msg.content.toString();
		console.log ("==> Adding message ", message);

		const master = redisHelper.connectToRedis(MASTER_URL);
		const setAsync = promisify(master.set).bind(master);
		const lock = promisify(require("redis-lock") (master));

    const unlock = await lock (MESSAGES_LOCK);
		console.log ("==> Lock acquired for message ", message);


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
		console.log ("==> Finished adding message ", message);

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
