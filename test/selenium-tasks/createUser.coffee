webdriver = require 'selenium-webdriver'

# this module runs a task to automatically create a new user and attempts to
# log that user in.
module.exports = (driver, homepage) ->
	username = "jon@mail.com"
	password = "pass"

	driver.get homepage + "/auth/login"
	# (driver.findElement (webdriver.By.xpath '//*[@id="main-nav"]/ul/a[6]/li')).click()
	(driver.findElement (webdriver.By.name 'username')).sendKeys username
	(driver.findElement (webdriver.By.name 'password')).sendKeys password
	(driver.findElement (webdriver.By.className 'submit')).click()


	# driver.wait (->
	# 	driver.getTitle().then (title) ->
	# 		console.log title
	# 		# title == 'webdriver - Google Search'
	# ), 1000