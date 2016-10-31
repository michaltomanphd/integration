var subscriber = require('../src/subscriber');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var server = require('http').createServer(app);

// done for deregistering an event
doneForDeregister = function (err) {
	if (err) {
	    console.log("Error is: " + err);
	}
	 else {
			console.log("OK");
	 }
}

// done for sending a message
doneForSendMessage = function (err) {
	if (err) {
	    console.log("Error is: " + err);
	}
	 else {
			// deregister an event
	 		subscriber.deregisterEvent("A", "T1", doneForDeregister);
	 }
}

// done for registering an event
doneForRegister = function (err) {
	if (err) {
	    console.log("Error is: " + err);
	}
	 else {
			// send a message
	 		subscriber.sendMessage("A", "T1", "DATA", doneForSendMessage);
	 }
}

// Receives a message
app.post('/receive', function (req, res) {
	id = req.body.id;
	type = req.body.type;
	message = req.body.message;
	console.log("Message has been received, where message=" + message);
	res.send('OK');
});

// listen at a port
server.listen(3081, function () {
  console.log('Test application is listening at 3081.');
});

// register an event
subscriber.registerEvent("A", "T1", 3081, doneForRegister);

// Stops an application
stopApplication = function() {
	server.close();
	console.log('Test application has ended');
}

// Sets handlers for signals
process.on('SIGINT', stopApplication);
process.on('SIGTERM', stopApplication);
