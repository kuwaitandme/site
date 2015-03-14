module.exports = (driver) ->
	username = 'jon@mail.com'
	password = 'pass'

	driver.url 'http://kme.com'
		.pause 1000
		.waitForVisible '#main-nav > ul > a:nth-child(6) li'
		.click '#main-nav > ul > a:nth-child(6) li'


		# Login Page
		.waitForVisible '#auth-username'
		.pause 500

		# Fill in the form and submit
		.setValue '#auth-username', username
		.setValue '#auth-password', password
		.pause 500
		.click '#login-form > section > div:nth-child(3) > input'