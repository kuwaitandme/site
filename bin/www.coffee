#!/usr/bin/env coffee
http = require 'http'
app  = require '../server/app'

# Create HTTP server.
server = http.createServer app

# Listen on port, on all network interfaces.
port = 3000

# Event listener for HTTP server "error" event
onError = (error) ->
	if error.syscall != 'listen' then throw error
	bind = if typeof port == 'string' then 'Pipe ' + port else 'Port ' + port

	# handle specific listen errors with friendly messages
	switch error.code
		when 'EACCES'
			console.error bind + ' requires elevated privileges'
			process.exit 1
		when 'EADDRINUSE'
			console.error bind + ' is already in use'
			process.exit 1
		else throw error

# Event listener for HTTP server "listening" event.
onListening = ->
	addr = server.address()
	bind = if typeof addr == 'string' then 'pipe ' + addr else 'port ' + addr.port
	console.log 'Listening on ' + bind

server.listen 3000
server.on 'error', onError
server.on 'listening', onListening