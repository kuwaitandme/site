module.exports = (driver, homepage) ->
	username = 'jon@mail.com'
	password = 'pass'

	classified =
		title: "This a title by selenium"
		description: "Lorem ipsum dolor sit amet, ius no oportere evertitur, causae persius an pri, mei eu sale mnesarchum percipitur. His offendit forensibus neglegentur id. Ut nec facilisis mnesarchum, et dicant discere diceret has. Duo ne atqui ceteros voluptua, errem sententiae id quo, cum utamur nostrum blandit et. Cibo facete mea ex, est ad paulo mandamus.\n\nImpetus deseruisse sit ut, ea dico tempor conceptam sea. Per ei splendide suscipiantur deterruisset, cum quas mnesarchum te. Te pri duis petentium suscipiantur, alienum dissentiet nam ut. Pro tale consequat moderatius at, at pri veri recusabo senserit."
		price: "12324"

	driver.url 'http://kme.com'
		.waitForVisible '#main-nav > ul > a:nth-child(6) li'
		.click '#main-nav > ul > a:nth-child(6) li'

		# Login Page
		.waitForVisible '#auth-username'

		# Fill in the form and submit
		.setValue '#auth-username', username
		.setValue '#auth-password', password
		.click '#login-form > section > div:nth-child(3) > input'

		# Home page
		# .url 'http://kme.com'
		.waitForVisible '#main-nav > ul > a:nth-child(4) > li'
		.click '#main-nav > ul > a:nth-child(4) > li'

		# page begin
		.waitForVisible '#page-begin > div.post-nav > a'
		.click '#page-begin > div.post-nav > a'

		# Page info
		.waitForVisible '#title', 2000
		.setValue '#title', "This a title by selenium"
		.setValue '#description', classified.description
		.click '#page-info > div.post-nav > a:nth-child(2)'

		# page details
		.waitForVisible '#price-selector', 2000
		.selectByVisibleText '#price-selector', 'Custom'
		.setValue '#price-field', "12324"
		.selectByVisibleText '#ctype', 'Offering'
		.selectByIndex '#cat-selector', 5
		.setValue '#email', 'myemail@mailer.com'
		.setValue '#phone', '+965 92312942'
		.selectByVisibleText '#locations', 'Salwa'
		.click '#page-details > div.post-nav > a:nth-child(2)'

		# page images
		.waitForVisible '#image-upload', 2000
		.click '#page-images > div.post-nav > a:nth-child(2)'