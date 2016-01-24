exports = module.exports = (IoC) ->
  NeedAuthenticationError = ->
    Error.captureStackTrace this, @constructor
    this.name = @constructor.name
    this.message = "NeedAuthentication"
    this.status = 401

  require("util").inherits NeedAuthenticationError, Error
  NeedAuthenticationError


exports["@singleton"] = true
exports["@require"] = ["$container"]