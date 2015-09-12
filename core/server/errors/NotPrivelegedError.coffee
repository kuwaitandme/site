exports = module.exports = ->
  NotPrivelegedError = ->
    Error.captureStackTrace this, @constructor
    this.name = @constructor.name
    this.message = "not priveleged to access content"
    this.status = 404

  require("util").inherits NotPrivelegedError, Error
  NotPrivelegedError


exports["@singleton"] = true