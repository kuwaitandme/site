formidable = require 'formidable'

module.exports = (request, response, next) ->
	response.contentType 'application/json'

	captachFail = ->
		response.status 401
		response.end '{}'

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

				classified = global.models.classified
				classified.create data, request.user, (cl) ->
					# If a classified was saved, then return it to the client.
					# The returned classified will contain the id parameter which
					# gets set by the database
					if cl then return response.end(JSON.stringify cl)

					# If no classified was returned, then nothing was saved.
					# Send a 400 Bad Request to the client
					response.status 400
					response.end()

	reCaptcha = global.helpers.reCaptcha
	reCaptcha.verify request, captachSuccess, captachFail