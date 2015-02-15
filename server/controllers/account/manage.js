var render = require('../helpers/render');

/**
 * Controller for the privacy page. Simply displays the privacy policy view.
 */
module.exports = {
	get: function(request, response, next) {

		/* Generate the response */
		return render(request, response, {
			bodyid: 'account-manage',
			page: 'account/manage',
			title: response.__('title.account.manage'),
		});
	}
}