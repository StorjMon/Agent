var config = require('./config.json');
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://mqtt.storjmon.com', {
  "clientId": config.serverkey,
  "username": config.serverkey,
  "password": config.serverkey
});
var sendthis;
client.on('connect', function() {
  client.subscribe('/h/' + config.serverkey + '/i/' + '+');
  console.log("Connected to StorjMon.com Network.")
})
client.on('message', function(topic, message) {
  if (message.toString() === 'restart') {
    tops = topic.split('/');
    restart(tops[4]);
  }
})

function restart(node) {
  console.log("Restarting node " + node);
  var dnode = require('dnode');
  var d = dnode.connect(config.rpcport);
  d.on('remote', function(rpc) {
    rpc.restart(node, () => {
      console.log('Restarted.');
    })
  })
}

function sendData() {
  var dnode = require('dnode');
  var d = dnode.connect(config.rpcport);
  d.on('remote', function(rpc) {
    rpc.status(function(err, shares) {
      console.log('---------------------------------------------');
      for (element in shares) {
        var farmerState = shares[element].meta.farmerState;
        sendthis = {};
        sendthis.id = shares[element].id;
        sendthis.state = shares[element].state;
        sendthis.doNotTraverseNat = shares[element].config.doNotTraverseNat;
        sendthis.storagePath = shares[element].config.storagePath;
        sendthis.storageAllocation = shares[element].config.storageAllocation;
        sendthis.uptimeMs = shares[element].meta.uptimeMs;
        sendthis.numRestarts = shares[element].meta.numRestarts;
        sendthis.bridgesConnectionStatus = farmerState.bridgesConnectionStatus;
        sendthis.percentUsed = farmerState.percentUsed;
        sendthis.spaceUsed = farmerState.spaceUsed;
        sendthis.totalPeers = farmerState.totalPeers;
        sendthis.lastActivity = farmerState.lastActivity;
        sendthis.contractCount = farmerState.contractCount;
        sendthis.dataReceivedCount = farmerState.dataReceivedCount;
        sendthis.spaceUsedBytes = farmerState.spaceUsedBytes;
        sendthis.listenPort = farmerState.portStatus.listenPort;
        sendthis.connectionStatus = farmerState.portStatus.connectionStatus;
        sendthis.connectionType = farmerState.portStatus.connectionType;
        sendthis.delta = farmerState.ntpStatus.delta;
        sendthis.deltaStatus = farmerState.ntpStatus.status;
        sendthis.serverStatus = '1';
        //  console.log(farmerState);
        console.log(farmerState.ntpStatus);
        console.log('--------------------!!!SEND THIS!!!-------------------------');
        console.log(sendthis)
        client.publish('/h/' + config.serverkey + '/o/' + sendthis.id, JSON.stringify(sendthis));
      }
      d.end();
    });
  });
}
setInterval(sendData, 120000);