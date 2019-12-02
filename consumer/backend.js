const redisHelper = require('./redisHelper');
const SLAVE_URL = "redis://redis-slave";
const MASTER_URL = "redis://redis-master";
const MESSAGES_KEY = "messages";

const slave = redisHelper.connectToRedis(SLAVE_URL);
const master = redisHelper.connectToRedis(MASTER_URL);

const {promisify} = require('util');

const getAsync = promisify(slave.get).bind(slave);
const setAsync = promisify(master.set).bind(master);
const lock = promisify(require("redis-lock")(master));

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

async function append (req, res) {
	console.log ("Appending messages " + req.params.message);

	const unlock = await lock(MESSAGES_KEY);

	messages = await retrieveMessages();

	if (messages == "") {
		messages = req.params.message;
	} else {
		messages += "," + req.params.message;
	}

	const result = await setAsync(MESSAGES_KEY, messages);

	unlock();

	console.log("Result: " + result);

	buildResponse (res, messages);
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
