var classifiedSingle = require('../classified/single'),
	classified = require('../../models/classified'),
	render = require('../helpers/render');


/**
 * Controller for the classified posting page. Creates a new classified and
 * saves it to the database.
 *
 * If the post is successfully validated, create the post and redirect to the
 * account page or else stay in the same page and display an error
 */
module.exports = {
	get: function(request, response, next) {
		var id = request.params.id;

		/* Get the classified */
		classified.get(id, function(classified) {

			console.log(classified, request.query)
			/* Display 404 page if classified is not found */
			if(!classified) return next();

			/* Display 404 if classified is not a guest classified */
			if(!classified.guest) return next();

			/* Display 404 if the authentication hash does not match */
			if(classified.authHash != request.query.authHash) return next();

			/* Generate the response */
			render(request, response, {
				bodyid: 'guest-single',
				description: classified.description,
				page: 'classified/single',
				scripts: ['googleMaps'],
				title: classified.title,

				data: {
					classified: classified,
					editable: true,
					superEditable: false
				}
			});
		});
	},

	post: function(request, response, next) {
		var id = request.params.id;
		var authHash = request.query.authHash;

		function finish(status, message) {
			response.redirect("/guest/single/" + id + "?"
				+ "authHash=" + authHash + "&" +
				status + "=" + message);
		}


		/* Only logged in users should be sending POST requests to this page */
		if(request.user) {
			var superEditable = false;
			var editable = false;

			classified.get(id, function(classified) {
				if(!classified) return finish("error", "notfound");

				/* Check user privileges and give an error message if the user
				 * doesn't have any privileges */
				if(!classified.guest) return finish('error', 'unpriv');
				if(classified.authHash != authHash) return finish('error', 'unpriv');

				/* Perform the admin action respectively */
				classifiedSingle.performAdmin(request, true, false, finish);
			});
		} else { finish("error", "needlogin"); }
	}
}