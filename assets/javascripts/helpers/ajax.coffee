module.exports =
	setHeaders: (request) ->
		request.setRequestHeader 'x-ajax', 'json'
		request.setRequestHeader 'x-csrf-skipper', true
		request.setRequestHeader 'csrf-token', window._csrf

		# If captcha is set, then pass it as a header
		captcha = ($ '[name="g-recaptcha-response"]').val()
		if captcha then  request.setRequestHeader 'x-gcaptcha', captcha