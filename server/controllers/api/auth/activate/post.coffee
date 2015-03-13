module.exports = (request, response, next) ->
	render = global.helpers.render

	# Get the parameters
	token = request.query.token
	id = request.params.id

	# Clean out the parameters
	if token.length != 24 or !/^[0-9A-F]*$/i.test(id)
		response.status 400
		return response.end 'badprameters'


	# Try and activate the user
	User = global.models.user
	User.activate id, token, (err, success) ->
		if err
			next(err)
			# response.status 500
			# return response.end 'activationerror'

		if success then response.end 'success'
		else
			response.status 401
			response.end 'activationfail'