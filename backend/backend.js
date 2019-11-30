var redisHelper = require('./redisHelper');
var REDIS_URL = "redis://robinhood-redis";

function getPortfolio (req, res) {
	console.log ("Retrieving stock " + req.params.stock);

	var client = redisHelper.connectToRedis(REDIS_URL);

	client.get(req.params.stock, function(err, reply) {
	    // reply is null when the key is missing
	    console.log("Result: " + reply);
			res.send (reply)
	});

}

module.exports = {
	getPortfolio: getPortfolio
}
