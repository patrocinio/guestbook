const redisHelper = require('./redisHelper');
const SLAVE_URL = "redis://redis-slave";
const MASTER_URL = "redis://redis-master";
const MESSAGES_KEY = "messages";

const slave = redisHelper.connectToRedis(SLAVE_URL);
const master = redisHelper.connectToRedis(MASTER_URL);

const {promisify} = require('util');

const getAsync = promisify(slave.get).bind(slave);
const setAsync = promisify(master.set).bind(master);

async function retrieveMessages () {
	console.log ("Retrieving messages ");

	const result = await getAsync(MESSAGES_KEY);

	console.log("Result: " + result);
	return result;
}

async function getMessages (req, res) {
	const result = await retrieveMessages();
	res.send(result)
}

async function append (req, res) {
	console.log ("Appending messages " + req.params.message);

	messages = await retrieveMessages();
	messages += "," + req.params.message;

	const result = await setAsync(MESSAGES_KEY, messages);

	console.log("Result: " + result);

	res.send(messages);
}

module.exports = {
	getMessages,
	append
}
