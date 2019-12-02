const redisHelper = require('./redisHelper');
const SLAVE_URL = process.env.SLAVE_URL || "redis://redis-slave";
const MESSAGES_KEY = "messages";

const slave = redisHelper.connectToRedis(SLAVE_URL);

const {promisify} = require('util');

const getAsync = promisify(slave.get).bind(slave);

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

function enqueueMessage (res, message, ch, q) {
	ch.sendToQueue(q, Buffer.from(message));

	res.send ("Message " + message + " enqueued")
}



function append (req, res) {
	console.log ("Appending messages " + req.params.message);

	queue.createMQConnection(QUEUE_NAME, res, req.params.message, enqueueMessage)
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
