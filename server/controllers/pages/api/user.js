var controller = module.exports = {

	/**
	 * [get description]
	 */
	get: function(request, response, next) {
		response.contentType('application/json');
		var id = request.params.id;

		/* If no id was set, get the current user instance */
		if(!id) {
			var user = request.user;

			/* If there was a logged in user, then return with some fields
			 * blanked out */
			if(user) {
				user.password = '';
				user.activationToken = '';
				return response.end(JSON.stringify(request.user));
			}

			/* Else return a 404 Not found */
			// response.status(404);
			return response.end("{}");
		}

		global.models.user.get(id, function(err, user) {
			if(!user) {
				response.status(404);
				response.end();
			}
			else {
				user.password = '';
				user.activationToken = '';
				response.end(JSON.stringify(user));
			}
		});
	}
}