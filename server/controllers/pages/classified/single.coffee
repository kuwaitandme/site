async     = require 'async'
validator = require 'validator'


controller = module.exports =
	get: (request, response, next) ->
		id = request.params.id
		superEditable = false
		editable = false

		if not validator.isMongoId id then return next()

		# Update the view counter asynchronously
		controller.updateViewCount request, id

		# Get the classified
		classified = global.models.classified
		classified.get id, (classified) ->

			# Display 404 page if classified is not found
			if not classified then return next()

			render = global.helpers.render
			render request, response,
				data: classified: classified
				description: classified.description
				page: 'classified/single'
				title: classified.title


	updateViewCount: (request, id) ->
		async.series [ (finish) ->

			# Get the views object from the session
			views = request.session.views
			if not views? then views = request.session.views = {}

			# Check if the user has visited this classified before
			if not views[id]?

				# If not, then increment the session counter by 1
				classified = global.models.classified
				classified.incrementViewCounter id

				# Let session know that the user has visited this page
				views[id] = true

			# Tell async that we are done
			finish null, null
 		]

# post: (request, response, next) ->
# 	id = request.params.id
# 	action = request.body.action

# 	finish = (status, message) ->
# 		if request.user and request.user.isAdmin
# 			response.redirect '/account/manage/'
# 		else
# 			response.redirect '/classified/single/' + id + '?' + status + '=' + message


# 	if !/^[0-9A-F]*$/i.test(id) then return next()

# 	# Only logged in users should be sending POST requests to this page or
# 	# POST request to report a classified are allowed.
# 	if request.user or action == 'report'
# 		superEditable = false
# 		editable = false

# 		classified.get id, (classified) ->
# 			if !classified then return finish('error', 'notfound')

# 			if action == 'report'
# 				return controller.reportClassified(id, request, finish)

# 			# Check user privileges and give an error message if the user
# 			# doesn't have any privileges
# 			if classified.owner == request.user._id then editable = true
# 			if request.user.isAdmin then  editable = superEditable = true

# 			if !editable and !superEditable then return finish('error', 'unpriv')

# 			# Perform the admin action respectively
# 			controller.performAdmin request, editable, superEditable, finish

# 	else finish 'error', 'needlogin'


# reportClassified: (id, request, finish) ->
# 	classified.report id, request.body.reason, request.connection.remoteAddress
# 	finish 'success', 'reported'


# performAdmin: (request, editable, superEditable, callback) ->
# 	id = request.params.id
# 	reason = request.body.reason

# 	switch request.body.action

# 		# These actions can only be performed by the classified owner
# 		when 'archive'
# 			classified.status.archive id
# 			callback('success', 'archived')

# 		when 'publish'
# 			classified.status.publish id
# 			callback('success', 'published')

# 		# The actions below can only be performed by an admin
# 		when 'ban'
# 			if request.user.isAdmin
# 				classified.status.ban id, reason or ''
# 				callback('success', 'banned')
# 			else callback('error', 'unpriv')

# 		when 'reject'
# 			if request.user.isAdmin
# 				classified.status.reject id, reason or ''
# 				callback('success', 'rejected')
# 			else callback('error', 'unpriv')

# 		when 'repost'
# 			if request.user.isAdmin
# 				classified.status.repost id
# 				callback('success', 'reposted')
# 			else callback('error', 'unpriv')