formidable = require 'formidable'

module.exports = (request, response, next) ->
	response.contentType 'application/json'

	captachFail = ->
		response.status 401
		response.end '"captcha failed"'

	captachSuccess = ->
		# Initialize formidable
		form = new formidable.IncomingForm
		form.keepExtensions = true
		form.multiples = true
		form.maxFieldsSize = 10 * 1024 * 1024 # 2MB

		# Setup error handler. This function gets called whenever there is an
		# error while processing the form.
		form.on 'error', (error) ->
			response.status 400
			response.end JSON.stringify error


		# Start parsing the form
		form.parse request, (error, fields, filesRequest) ->
			if error then return next error

			data = JSON.parse fields.data
			files = filesRequest['files[]']

			file = global.helpers.file
			file.upload files, (error, files) ->

				if error
					response.status 400
					return response.end JSON.stringify error

				data.images = files

				classified = global.models.classified
				classified.create data, request.user, (error, cl) ->
					# If error was set, then nothing was saved.
					# Send a 400 Bad Request to the client
					if error
						file.delete files
						response.status 400
						return response.end JSON.stringify error

					# If a classified was saved, then return it to the client.
					# The returned classified will contain the id parameter which
					# gets set by the database
					if cl then return response.end JSON.stringify cl


	reCaptcha = global.helpers.reCaptcha
	reCaptcha.verify request, captachSuccess, captachFail