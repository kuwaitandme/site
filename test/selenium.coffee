webdriver = require 'selenium-webdriver'

driver = (new (webdriver.Builder)).withCapabilities(webdriver.Capabilities.chrome()).build()
homepage = 'https://kme.com'
tasks = require './selenium/index'

for task in tasks
	driver.get homepage
	task(driver)

# driver.quit()