/**
 * Controller for the logout page. If accessed, it immediately logs out the
 * currently logged in user and redirects to the homepage.
 */
module.exports = {
	get: function(request, response, next) {
		request.session.destroy();
		return response.redirect('/auth/login?success=logout');
	}
}