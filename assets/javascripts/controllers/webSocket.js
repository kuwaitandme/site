/**
 * The WebSockets controller. Here we make use of HTML 5's websocket library to
 * create a websocket between the client and the server. Websockets are a really
 * nice way of having 'PUSH' style notification for this app.
 */
var controller = module.exports = function() {
	/**
	 * Initializes the websocket. It requires a URL to connect to the websocket
	 * which gets specified in the config object.
	 *
	 * @param  Object   config     The config object containing the URL to
	 *                             connect to.
	 */
	controller.prototype.initialize= function(config) {
		console.log("[init] websocket");

		this.requestsArray = {};
		var that = this;

		var ws = this.ws  = new WebSocket(config.url);
		ws.onclose = function() { console.info("[info] websocket closed"); };
		ws.onmessage = function(event) { that.messageHandler(event); };
		ws.onerror = function(err) {
			console.error("[error] websocket error: ", err);
		};
		ws.onopen = function() {
			console.info("[info] websocket opened on ", config.url);
		};

		console.log("[done] websocket");
	};


	/**
	 * This function is responsible for properly communicating with the server's
	 * websocket, taking care of things like handling data types and using
	 * callback function.
	 *
	 * @param  Object     messageObject The message Object that gets sent to the
	 *                                  server.
	 * @param  Function   callback      The callback function to call with the
	 *                                  data received from the server. It will
	 *                                  take in two arguments. The first is the
	 *                                  response from the server and the second
	 *                                  is the original request.
	 */
	controller.prototype.send = function (messageObject, callback) {
		var uniqueId = Math.floor((Math.random() * 1000) + 1);
		messageObject.requestId = uniqueId;

		var requestObject = {
			callback: null,
			request: messageObject
		};

		if(callback)
			requestObject.callback = callback;

		this.requestsArray[uniqueId] = requestObject;

		var request = JSON.stringify(messageObject);
		this.ws.send(request);
	};


	/**
	 * Handles the message sent from the server websocket. Usuallt the server
	 * is supposed to return a JSON with the requestId variable (if any) left
	 * unmodified. This helps us find the right callback function to call
	 * with the request data, if a callback function was specified during the
	 * send operation.
	 *
	 * @param  Object   event   The event object
	 */
	controller.prototype.messageHandler = function(event) {
		var response = event.data;
		var parsedMessage = JSON.parse(response);
		var requestObject = this.requestsArray[parsedMessage.requestId];

		console.debug("[debug] message from websocket: ", parsedMessage);

		if(requestObject) {
			if(requestObject.callback)
				requestObject.callback(parsedMessage, requestObject.request);

			this.requestsArray[parsedMessage.requestId] = null;
		}
	}
}