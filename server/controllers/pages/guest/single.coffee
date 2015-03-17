validator = require 'validator'


# Controller for the classified posting page. Creates a new classified and
# saves it to the database.
#
# If the post is successfully validated, create the post and redirect to the
# account page or else stay in the same page and display an error
controller = module.exports =
	get: (request, response, next) ->
		id = request.params.id
		authHash = request.query.authHash

		if not validator.isMongoId id or not /^[0-9A-Za-z-]*$/.test authHash
			return next()

		# Get the classified
		classified = global.models.classified
		classified.get id, (classified) ->

			# Display 404 page if classified is not found
			if not classified then return next()

			# Display 404 if classified is not a guest classified
			if not classified.guest then return next()

			# Display 404 if the authentication hash does not match
			if classified.authHash != authHash then return next()

			# Generate the response
			render = global.helpers.render
			render request, response,
				data: classified: classified
				description: classified.description
				page: 'classified/single'
				title: classified.title


	# post: (request, response, next) ->
	# 	id = request.params.id
	# 	authHash = request.query.authHash

	# 	finish = (status, message) ->
	# 		response.redirect '/guest/single/' + id + '?' + 'authHash=' + authHash + '&' + status + '=' + message

	# 	if not (/^[0-9A-F]*$/i.test id) then return next()
	# 	if not (!/^[0-9A-Za-z-]*$/.test authHash) then return next()

	# 	# Only logged in users should be sending POST requests to this page
	# 	if request.user
	# 		superEditable = false
	# 		editable = false
	# 		classified.get id, (classified) ->
	# 			if not classified then return finish('error', 'notfound')

	# 			# Check user privileges and give an error message if the user
	# 			# doesn't have any privileges
	# 			if not classified.guest then return finish('error', 'unpriv')
	# 			if classified.authHash != authHash then return finish('error', 'unpriv')

	# 			# Perform the admin action respectively
	# 			classifiedSingle.performAdmin request, true, false, finish

	# 	else finish 'error', 'needlogin'