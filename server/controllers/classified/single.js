var async = require('async');

var classified = require('../../models/classified'),
	render = require('../helpers/render');


/**
 * Controller for the classified posting page. Creates a new classified and
 * saves it to the database.
 *
 * If the post is successfully validated, create the post and redirect to the
 * account page or else stay in the same page and display an error
 */
module.exports = controller = {
	/**
	 * [get description]
	 *
	 * @param  {[type]}   request  [description]
	 * @param  {[type]}   response [description]
	 * @param  {Function} next     [description]
	 */
	get: function(request, response, next) {
		var id = request.params.id;
		var superEditable = false;
		var editable = false;

		/* Update the view counter asynchronously */
		controller.updateViewCount(request, id);

		/* Get the classified */
		classified.get(id, function(classified) {
			/* Display 404 page if classified is not found */
			if(!classified) return next();

			if(classified.owner == request.user._id) editable = true;
			if(request.user.isAdmin) editable = superEditable = true;

			classified.authHash = "";


			/* Generate the response */
			render(request, response, {
				bodyid: 'classified-single',
				description: classified.description,
				page: 'classified/single',
				scripts: ['googleMaps'],
				title: classified.title,

				data: {
					classified: classified,
					editable: editable,
					superEditable: superEditable
				}
			});
		});
	},


	/**
	 * [post description]
	 *
	 * @param  {[type]}   request  [description]
	 * @param  {[type]}   response [description]
	 * @param  {Function} next     [description]
	 */
	post: function(request, response, next) {
		var id = request.params.id;

		function finish(status, message) {
			response.redirect("/classified/single/" + id + "?" + status +
				"=" + message);
		}


		/* Only logged in users should be sending POST requests to this page */
		if(request.user) {
			var superEditable = false;
			var editable = false;

			classified.get(id, function(classified) {
				if(!classified) return finish("error", "notfound");

				/* Check user privileges and give an error message if the user
				 * doesn't have any privileges */
				if(classified.owner == request.user._id) editable = true;
				if(request.user.isAdmin) editable = superEditable = true;
				if(!editable && !superEditable) return finish('error', 'unpriv');

				/* Perform the admin action respectively */
				controller.performAdmin(request, editable, superEditable, finish);

			});
		} else { finish("error", "needlogin"); }
	},

	/**
	 * Asynchronously checks the session of the user and updates the view counter
	 * for the classified with the given id.
	 *
	 * @param  Object request    The request object
	 * @param  Number id         The id of the classified for which we want to
	 *                           update the view counter.
	 */
	updateViewCount: function(request, id) {
		async.series([function(finish){
			/* Get the views object from the session */
			var views = request.session.views;
			if (!views) views = request.session.views = {};

			/* Check if the user has visited this classified before */
			if(typeof views[id] === 'undefined') {
				/* If not, then increment the session counter by 1 */
				classified.incrementViewCounter(id);

				/* Let session know that the user has visited this page */
				views[id] = true;
			}

			/* Tell async that we are done */
			finish(null, null);
		}]);
	},


	/**
	 * [performAdmin description]
	 *
	 * @param  {[type]}   request       [description]
	 * @param  {[type]}   editable      [description]
	 * @param  {[type]}   superEditable [description]
	 * @param  {Function} callback      [description]
	 * @return {[type]}                 [description]
	 */
	performAdmin: function(request, editable, superEditable, callback) {
		var id = request.params.id;
		var reason = request.params.reason;

		switch(request.body.action) {
			/* These actions can only be performed by the classified owner */
			case 'archive':
				classified.status.archive(id);
				return callback("success", "archived");

			case 'publish':
				classified.status.publish(id);
				return callback("success", "published");

			/* The actions below can only be performed by an admin */
			case 'ban':
				if(request.user.isAdmin) {
					classified.status.ban(id, reason || "");
					return callback("success", "banned");
				}
				return callback("error", "unpriv");

			case 'reject':
				if(request.user.isAdmin) {
					classified.status.reject(id, reason || "");
					return callback("success", "rejected");
				}
				return callback("error", "unpriv");

			case 'repost':
				if(request.user.isAdmin) {
					classified.status.repost(id);
					return callback("success", "reposted");
				}
				return callback("error", "unpriv");
		}
	}
}