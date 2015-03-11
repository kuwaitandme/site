async = require 'async'

classified = global.models.classified


controller = module.exports =

	get: (request, response, next) ->
		id = request.params.id
		superEditable = false
		editable = false

		if !/^[0-9A-F]*$/i.test(id) then return next()

		# Update the view counter asynchronously
		controller.updateViewCount request, id

		# Get the classified
		classified.get id, (classified) ->

			# Display 404 page if classified is not found
			if !classified then return next()


			if request.user
				if classified.owner == request.user._id then editable = true
				if request.user.isAdmin then editable = superEditable = true

			classified.authHash = ''

			data =
				classified: classified
				editable: editable
				superEditable: superEditable

			render = globals.helpers.render
			render request, response,
				bodyid: 'classified-single'
				data: data
				description: classified.description
				page: 'classified/single'
				scripts: [ 'googleMaps' ]
				title: classified.title


	post: (request, response, next) ->
		id = request.params.id
		action = request.body.action

		finish = (status, message) ->
			if request.user and request.user.isAdmin
				response.redirect '/account/manage/'
			else
				response.redirect '/classified/single/' + id + '?' + status + '=' + message


		if !/^[0-9A-F]*$/i.test(id) then return next()

		# Only logged in users should be sending POST requests to this page or
		# POST request to report a classified are allowed.
		if request.user or action == 'report'
			superEditable = false
			editable = false

			classified.get id, (classified) ->
				if !classified then return finish('error', 'notfound')

				if action == 'report'
					return controller.reportClassified(id, request, finish)

				# Check user privileges and give an error message if the user
				# doesn't have any privileges
				if classified.owner == request.user._id then editable = true
				if request.user.isAdmin then  editable = superEditable = true

				if !editable and !superEditable then return finish('error', 'unpriv')

				# Perform the admin action respectively
				controller.performAdmin request, editable, superEditable, finish

		else finish 'error', 'needlogin'


	reportClassified: (id, request, finish) ->
		classified.report id, request.body.reason, request.connection.remoteAddress
		finish 'success', 'reported'


	updateViewCount: (request, id) ->
		async.series [ (finish) ->

			# Get the views object from the session
			views = request.session.views
			if !views then views = request.session.views = {}

			# Check if the user has visited this classified before
			if typeof views[id] == 'undefined'

				# If not, then increment the session counter by 1
				classified.incrementViewCounter id

				# Let session know that the user has visited this page
				views[id] = true

			# Tell async that we are done
			finish null, null
 		]


	performAdmin: (request, editable, superEditable, callback) ->
		id = request.params.id
		reason = request.body.reason

		switch request.body.action

			# These actions can only be performed by the classified owner
			when 'archive'
				classified.status.archive id
				callback('success', 'archived')

			when 'publish'
				classified.status.publish id
				callback('success', 'published')

			# The actions below can only be performed by an admin
			when 'ban'
				if request.user.isAdmin
					classified.status.ban id, reason or ''
					callback('success', 'banned')
				else callback('error', 'unpriv')

			when 'reject'
				if request.user.isAdmin
					classified.status.reject id, reason or ''
					callback('success', 'rejected')
				else callback('error', 'unpriv')

			when 'repost'
				if request.user.isAdmin
					classified.status.repost id
					callback('success', 'reposted')
				else callback('error', 'unpriv')
