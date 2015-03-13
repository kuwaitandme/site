# Controller for the logout page. If accessed, it immediately logs out the
# currently logged in user and redirects to the homepage.
module.exports = (request, response, next) ->
	request.session.destroy()
	response.contentType 'application/json'
	response.end 'loggedout'