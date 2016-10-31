var request = require('request');

/*
Registers an event
*/
exports.registerEvent = function (id, type, port, done)
{
		request.post(
									'http://localhost:3080/register',
									{
											form: {
															id: id,
															type: type,
															port: port
											}
									},
									function (error, response, body) {
											handleServiceError (error, response, body, done);
									}
		);
}

/*
Deregisters an event
*/
exports.deregisterEvent = function (id, type, done)
{
		request.post(
									'http://localhost:3080/deregister',
									{
											form: {
															id: id,
															type: type
											}
									},
									function (error, response, body) {
											handleServiceError (error, response, body, done);
									}
		);
}

/*
Sends a message
*/
exports.sendMessage = function (id, type, message, done)
{
		request.post(
									'http://localhost:3080/send',
									{
											form: {
															id: id,
															type: type,
															message: message
											}
									},
									function (error, response, body) {
											handleServiceError (error, response, body, done);
									}
		);
}

/*
Handles an error from a service
*/
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
