createPostGuest = require './createPostGuest'
loginUser       = require './loginUser'

module.exports = (driver, homepage) ->
	loginUser(driver)
	createPostGuest(driver)