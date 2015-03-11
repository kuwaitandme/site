redis = require 'redis'
client = redis.createClient null, null, detect_buffers: true

config = global.config

controller = module.exports = get: (request, response, next) ->
	response.contentType 'application/json'

	# Check the redis DB to see if our queries are cached or not
	client.get 'location', (err, result) ->
		if result then return response.end (JSON.stringify result)


		# If we reach here, then the query was not cached. Execute the
		# query and cache it for next time
		location = global.models.location
		location.getAll (result) ->
			json = JSON.stringify result
			client.set 'location', json
			response.end json