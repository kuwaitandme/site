jade   = require 'jade'
redis  = require 'redis'

client = redis.createClient null, null, detect_buffers: true


# A helper function to render the page properly with the right parameters and
# some default values.
module.exports = (request, response, args={}, cache=false) ->

	# Render the page. This function is responsible for setting up all the
	# variables properly as well as saving the view into the cache if needed
	render = (redisError) ->
		if redisError then throw err

		config = global.config
		args.environment = config.mode
		args.data = args.data or {}
		args.data.captchaKey = config.reCaptcha.site
		args.data.jsVersion = config.jsVersion
		args.data.ga = config.ga
		args.data.user = request.user
		args.title = "#{args.title} | Kuwait &amp; Me"
		args._ =  global.__
		# args.data.csrf = csrfToken

		# Render the page
		html = jade.renderFile "#{global.root}/views/main/#{args.page}.jade", args

		# If we are caching this page, then set it into the cache
		if cache then client.set 'page:' + args.page, html

		# Return the page
		response.end html


	# If we are looking in our cache, then try to find the view in the cache
	if cache then  client.get 'page:' + args.page, (err, result) ->
		if err then render err

		# If the cache was found, then return it
		if result then response.end result
		# Else re-render the page and then save it into the cache
		else render null


	# render the page if we are not looking in the cache
	else render null