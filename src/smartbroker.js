var express = require('express');
var request = require('request');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var server = require('http').createServer(app);

// map of registered events
var mapOfRegisteredEvents = {};

// Registers an event
app.post('/register', function (req, res) {
	id = req.body.id;
	type = req.body.type;
	port = req.body.port;
	key = id + "_" + type;
	if (mapOfRegisteredEvents[key] != null) {
		res.send('Already exists');
	}
	else {
		mapOfRegisteredEvents[key] = {
																			id: id,
																			type: type,
																			port: port
																	}
		res.send('OK');
	}
});

// deregister an event
app.post('/deregister', function (req, res) {
	id = req.body.id;
	type = req.body.type;
  key = id + "_" + type;
	if (mapOfRegisteredEvents[key] == null) {
		res.send('Not exists');
	}
	else {
		mapOfRegisteredEvents[key] = null;
		res.send('OK');
	}
});

// Sends a message
app.post('/send', function (req, res) {
	id = req.body.id;
	type = req.body.type;
	message = req.body.message;
  key = id + "_" + type;
	if (mapOfRegisteredEvents[key] == null) {
		res.send('Not exists');
	}
	else {
		forwardMessage(id, type, message);
		res.send('OK');
	}
});


// Forwards a message
forwardMessage = function (id, type, message) {

		// initialize
		key = id + "_" + type;
		reqParams = mapOfRegisteredEvents[key]
		
		// done for forwarding a message
		doneForForwardMessage = function (err) {
			if (err) {
			    console.log("Forward error is: " + err);
			}
			 else {
					console.log("Forward OK");
			 }
		}

		// forward a message
		request.post(
										'http://localhost:' + reqParams.port + '/receive',
										{
												form: {
																id: id,
																type: type,
																message: message
												}
										},
										function (error, response, body) {
												handleServiceError (error, response, body, doneForForwardMessage);
										}
				);
}

// Handles an error from a service
handleServiceError = function (error, response, body, done)
{
		if (!error && response.statusCode == 200) {
				done(undefined);
		}
		else {
		    if (error) {
						done(error);
				}
				else if (body !== "OK") {
						done(new Error("Error: " + body));
				}
				else {
				    done(new Error("Error: " + response.statusCode));
				}
		}
}

// listen at a port
server.listen(3080, function () {
  console.log('SmartBroker is listening at 3080.');
});

// Stops an application
stopApplication = function() {
	server.close();
	console.log('SmartBroker has ended');
}

// Sets handlers for signals
process.on('SIGINT', stopApplication);
process.on('SIGTERM', stopApplication);
