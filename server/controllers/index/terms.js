var render = require('../helpers/render');

/**
 * Controller for the terms and conditions page. Simply displays the 'terms and
 * conditions' view.
 */
module.exports = {
	get: function(request, response, next) {

		/* Generate the response */
		return render(request, response, {
			bodyid: "terms",
			page: 'terms',
			title: response.__('title.terms'),
		});
	}
}