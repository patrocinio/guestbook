const redisHelper = require('./redisHelper');
const MASTER_URL = "redis://redis-master";
const SLAVE_URL = "redis://redis-slave";
const MESSAGES_KEY = "messages";

const slave = redisHelper.connectToRedis(SLAVE_URL);
const master = redisHelper.connectToRedis(MASTER_URL);

const {promisify} = require('util');

const getAsync = promisify(slave.get).bind(slave);
const setAsync = promisify(master.set).bind(master);

const queue = require ('./queue');
const QUEUE_NAME = "messages";

async function retrieveMessages () {
	console.log ("Retrieving messages ");

	const result = await getAsync(MESSAGES_KEY);

	console.log("Result: " + result);
	return result;
}

function buildResponse (res, messages) {

	const result = {
		data: messages
	}
	res.send(result);

}

async function getMessages (req, res) {
	const messages = await retrieveMessages();
	buildResponse (res, messages);
}

function append (req, res) {
	let message = req.params.message
	console.log ("Appending messages " + message);

	queue.createMQConnection(QUEUE_NAME, function (ch, q) {
		ch.sendToQueue(q, Buffer.from(message));

		res.send ("Message " + message + " enqueued")
	})
}

async function clear (req, res) {
	console.log ("Clearing messages ");

	const result = await setAsync(MESSAGES_KEY, "");

	console.log("Result: " + result);

	buildResponse (res, "");
}

module.exports = {
	getMessages,
	append,
	clear
}
