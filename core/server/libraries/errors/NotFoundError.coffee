exports = module.exports = (IoC) ->
  NotFoundError = ->
    Error.captureStackTrace this, @constructor
    this.name = @constructor.name
    this.message = "page not found"
    this.status = 404

  require("util").inherits NotFoundError, Error
  NotFoundError


exports["@singleton"] = true
exports["@require"] = ["$container"]
