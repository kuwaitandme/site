exports = module.exports = (IoC) ->
  BadParameters = ->
    Error.captureStackTrace this, @constructor
    this.name = @constructor.name
    this.message = "BadParameters"
    this.status = 400

  require("util").inherits BadParameters, Error
  BadParameters


exports["@singleton"] = true
exports["@require"] = ["$container"]