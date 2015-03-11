redis = require('redis')
client = redis.createClient(null, null, detect_buffers: true)

category = global.models.category
config = global.config
location = global.models.location


# A helper function to render the page properly with the right parameters and
# some default values.
module.exports = (request, response, args) ->
	common = []

	# If the AJAX header is set, then set the response type to JSON and print
	# out only the main content
	if request.headers['x-ajax']
		response.contentType 'application/json'
		return response.end(JSON.stringify(args.data))

	if request.csrfToken then csrfToken = request.csrfToken()

	response.render 'main/' + args.page,
		csrfToken: csrfToken or ''
		description: args.description or ''
		title: "#{args.title} | Kuwait &amp; Me"

		bodyid: args.bodyid or ''
		data: args.data or ''

		ga: config.ga
		jsVersion: config.jsVersion
		user: request.user