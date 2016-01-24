exports = module.exports = (IoC) ->
  BadApiToken = ->
    Error.captureStackTrace this, @constructor
    this.name = @constructor.name
    this.message = "BadApiToken"
    this.status = 400

  require("util").inherits BadApiToken, Error
  BadApiToken


exports["@singleton"] = true
exports["@require"] = ["$container"]