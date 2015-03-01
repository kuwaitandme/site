var render = require('../../helpers/render');

/**
 * Controller for the privacy page. Simply displays the privacy policy view.
 */
module.exports = {
	get: function(request, response, next) {

		/* Generate the response */
		return render(request, response, {
			bodyid: 'account',
			page: 'account/index',
			title: response.__('title.account'),
		});
	},

	manage: require('./manage'),
	profile: require('./profile')
}