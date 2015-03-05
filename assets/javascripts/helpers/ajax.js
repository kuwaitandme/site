module.exports = {
	setHeaders: function (request) {
		request.setRequestHeader("x-ajax", "json");
		request.setRequestHeader("x-csrf-skipper", true);
		request.setRequestHeader("csrf-token", window._csrf);

		/* If captcha is set, then pass it as a header */
		var captcha = $('#g-recaptcha-response').val();
		if(captcha) request.setRequestHeader("x-gcaptcha", captcha);
	}
}