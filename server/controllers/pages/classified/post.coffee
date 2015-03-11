formidable = require 'formidable'

classified = global.models.classified
config = global.config


controller = module.exports =
	get: (request, response, next) ->
		if !request.isAuthenticated() then return response.redirect('/auth/guest')

		render = global.helpers.render
		render request, response,
			bodyid: 'classified-post'
			description: null
			page: 'classified/post'
			title: response.__('title.classified.post')

			data:
				sitekey: config.reCaptcha.site


	post: (request, response, next) ->
		response.contentType 'application/json'
		that = this

		captachFail = ->
			response.status 401
			response.end()

		captachSuccess = ->
			# Initialize formidable
			form = new (formidable.IncomingForm)
			form.keepExtensions = true
			form.multiples = true
			form.maxFieldsSize = 10 * 1024 * 1024 # 10MB

			# Start parsing the form
			form.parse request, (err, fields, filesRequest) ->
				if err then throw err

				data = JSON.parse(fields.data)
				files = filesRequest['files[]']

				file = global.helpers.file
				file.upload files, (files) ->
					data.images = files
					classified.create data, request.user, (cl) ->
						# If a classified was saved, then return it to the client. Th
						# returned classified will contain the id parameter which
						# wasn't there before.
						if cl then return response.end( JSON.stringify cl)

						# If no classified was returned, then nothing was saved.
						# Send a 400 Bad Request to the client
						response.status 400
						response.end()

		reCaptcha = global.helpers.reCaptcha
		reCaptcha.verify request, captachSuccess, captachFail


	put: (request, response, next) ->
		response.contentType 'application/json'

		# Check the header to see if this is a file upload form or not
		if response.header('x-fileupload')
			return controller.doUpload request, response, next

		# Check the header to see if we are updating the files or not
		if response.header('x-fileupdate') then return next()

		# return controller.doUpload(request, response, next);
		next()