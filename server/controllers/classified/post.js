var classified = require('../../models/classified'),
	render = require('../helpers/render');

module.exports = {
	/**
	 * Controller for the classified posting page. Creates a new classified and
	 * saves it to the database.
	 *
	 * If the post is successfully validated, create the post and redirect to the
	 * account page or else stay in the same page and display an error
	 */
	get: function(request, response, next) {
		if (!request.isAuthenticated()) return response.redirect('/auth/guest');

		/* Generate the response */
		return render(request, response, {
			bodyid: 'classified-post',
			description: null,
			page: 'classified/post',
			title: response.__('title.classified.post')
		});
	},


	/**
	 * Controller to create the new classified
	 */
	post: function(request, response, next) {
		return file.upload(request, function(uploadedFiles) {

			return classified.createFromPOST(request, false, function(classified) {
				/* Save the images */
				classified.images = uploadedFiles;
				classified.save();

				/* Write to the page the link to redirect. This gets picked up
				 * by our AJAX controller */
				return response.end("/classified/single/" + classified._id);
			});
		});
	}
}