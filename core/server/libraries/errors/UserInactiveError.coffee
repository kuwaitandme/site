exports = module.exports = (IoC) ->
  UserInactiveError = ->
    Error.captureStackTrace this, @constructor
    this.name = @constructor.name
    this.message = "UserInactiveError"
    this.status = 401

  require("util").inherits UserInactiveError, Error
  UserInactiveError


exports["@require"] = ["$container"]
exports["@singleton"] = true