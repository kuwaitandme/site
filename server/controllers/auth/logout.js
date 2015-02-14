/**
 * Controller for the logout page. If accessed, it immediately logs out the
 * currently logged in user and redirects to the homepage.
 */
module.exports = {
	get: function(request, response, next) {
		request.logout();
		return response.redirect('/auth/login?status=loggedout');
	}
}