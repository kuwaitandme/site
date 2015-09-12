exports = module.exports = (IoC) ->
  NeedAuthenticationError = ->
    Error.captureStackTrace this, @constructor
    this.name = @constructor.name
    this.message = "you have to be logged in"
    this.status = 401

  require("util").inherits NeedAuthenticationError, Error
  NeedAuthenticationError


exports["@singleton"] = true
exports["@require"] = ["$container"]
