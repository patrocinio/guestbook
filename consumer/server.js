const queue = require ('./queue');
const QUEUE_NAME = "messages";

queue.createMQConnection(QUEUE_NAME, function (channel, queue) {
  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
  channel.consume(queue, function(msg) {
    console.log(" [x] Received %s", msg.content.toString());
  }, {
      noAck: true
    });
});
