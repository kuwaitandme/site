exports = module.exports = (IoC) ->
  ReCaptchaError = ->
    Error.captureStackTrace this, @constructor
    this.name = @constructor.name
    this.message = "reCaptchaFailed"
    this.status = 400

  require("util").inherits ReCaptchaError, Error
  ReCaptchaError


exports["@require"] = ["$container"]
exports["@singleton"] = true