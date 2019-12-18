var mq = require('ibmmq');

const qMgr = "mymqv4";

const cno = new mq.MQCNO();

cno.Options = mq.MQC.MQCNO_CLIENT_BINDING;

const cd = new mq.MQCD();
cd.ConnectionName = "icp-proxy.patrocinio8-fa9ee67c9ab6a7791435450358e564cc-0001.us-east.containers.appdomain.cloud(31202)";
cd.ChannelName = "SYSTEM.DEF.SVRCONN";
cno.ClientConn = cd;

function createMQConnection(queue_name, callback) {
    console.log ("Connecting to MQ at " + cd.ConnectionName);

    mq.Connx(qMgr, cno, function (err, conn) {
      if (err) {
        console.log (err)
      } else {
        console.log ("MQCONN to %s successful", qMgr);
      }
    })
}

module.exports = {
    createMQConnection: createMQConnection
}
