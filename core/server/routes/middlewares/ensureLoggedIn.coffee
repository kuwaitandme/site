ensureLoggedIn = require "connect-ensure-login"

module.exports = -> ensureLoggedIn.ensureLoggedIn "/login?error=need_login"

exports["@singleton"] = true