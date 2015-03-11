redis  = require 'redis'

client = redis.createClient null, null, detect_buffers: true



# A helper function to render the page properly with the right parameters and
# some default values.
module.exports = (request, response, args) ->
	common = []

	args.data = args.data or {}
	# If the AJAX header is set, then set the response type to JSON and print
	# out only the main content
	if request.headers['x-ajax']
		response.contentType 'application/json'
		return response.end (JSON.stringify args.data)

	if request.csrfToken then csrfToken = request.csrfToken()

	finish = (err, categories) ->
		if err then throw err

		config = global.config
		args.data.categories = JSON.parse categories
		args.data.captchaKey = config.reCaptcha.site
		args.data.jsVersion = config.jsVersion
		args.data.ga = config.ga
		args.data.user = request.user
		args.data.csrf = csrfToken

		response.render 'main/' + args.page,
			description: args.description or ''
			title:       "#{args.title} | Kuwait &amp; Me"

			bodyid:      args.bodyid or ''
			data:        args.data or {}

	client.get 'categories', (err, result) ->
		if result then return finish err, result

		category = global.models.category
		category.getAll (result) ->
			json = JSON.stringify result
			client.set 'categories', json
			finish null, result
