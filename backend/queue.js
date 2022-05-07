var amqp = require('amqplib/callback_api');
const queueHost = process.env.QUEUE_HOST || "messaging"

function createMQConnection(queue_name, callback) {
    console.log ("Connecting to MQ at " + queueHost)
    amqp.connect('amqp://' + queueHost, function(err, conn) {
        if (err) {
            console.log ("Error: " + err)
        } else {
            console.log ("Creating queue " + queue_name)
            conn.createChannel(function(err, ch) {
                ch.assertQueue(queue_name, {durable: false});

                callback(ch, queue_name)
            });
        }
    });

}

module.exports = {
    createMQConnection: createMQConnection
}
