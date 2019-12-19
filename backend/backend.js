const redisHelper = require('./redisHelper');
const MASTER_URL = "redis://redis-master";
const SLAVE_URL = "redis://redis-slave";
const MESSAGES_KEY = "messages";

const slave = redisHelper.connectToRedis(SLAVE_URL);
const master = redisHelper.connectToRedis(MASTER_URL);

const {promisify} = require('util');

const getAsync = promisify(slave.get).bind(slave);
const getMasterAsync = promisify(master.get).bind(master);
const setAsync = promisify(master.set).bind(master);

const queue = require ('./queue');
const QUEUE_NAME = "messages";

async function retrieveMessages () {
	console.log ("Retrieving messages ");

	const result = await getAsync(MESSAGES_KEY);

	console.log("Result: " + result);
	return result;
}

async function retrieveMasterMessages () {
	console.log ("Retrieving master messages ");

	const result = await getMasterAsync(MESSAGES_KEY);

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

async function getMasterMessages (req, res) {
	const messages = await retrieveMasterMessages();
	buildResponse (res, messages);
}

function append (req, res) {
	let message = req.params.message;
	console.log ("Appending messages " + message);;

	queue.createMQConnection(QUEUE_NAME, function (ch, q) {
		ch.sendToQueue(q, Buffer.from(message));
	});

	const result = {
		msg: "Message " + message + " enqueued"
	};

	res.send (result);
}

async function clear (req, res) {
	console.log ("Clearing messages ");

	const result = await setAsync(MESSAGES_KEY, "");

	console.log("Result: " + result);

	buildResponse (res, "");
}

function emptyQueue (req, res) {
	console.log ("Retrieving queue size...");

	queue.createMQConnection(QUEUE_NAME, function (channel, queue) {
		console.log(" [*] Getting messages in %s", queue);
	  channel.get(queue, { noAck: false }, function(error, msg) {
	    console.log(" [x] Received %s", msg);
			if (msg == false) {
				buildResponse (res, true);
			} else {
				channel.nack (msg);
				buildResponse (res, false);
			}
	  });
	});
}

module.exports = {
	getMessages,
	append,
	clear,
	emptyQueue,
	getMasterMessages
}
