###
  @apiDefine CheckCaptcha

  @apiParam {String} gcaptcha The respsonse from Google's ReCaptcha
  @apiErrorExample {json} Captcha Error
    HTTP/1.1 403 Forbidden
    {
      "error": "reCaptchaFailed"
    }
###


###
This middleware is responsible for making sure that the requests that pass
through are human-validated using google's reCaptcha.

If a request contains the special "x-recaptcha-bypass" which has the value
of the reCaptcha bypass key, then the capthca get bypassed. This is useful if
8the admin wants to automate some of the content or allow access to it from
mobile (because reCaptcha wouldn't be ideal there).
###
Middleware = module.exports = (settings, reCaptcha, reCaptchaError) ->
  bypassKey = settings.reCaptcha.bypassKey

  (request, response, next) ->
    if request.headers["x-recaptcha-bypass"] is bypassKey then return next()

    reCaptcha.verify request
    .then -> next()
    .catch (e) -> next new reCaptchaError()


Middleware["@require"] = [
  "igloo/settings"
  "libraries/recaptcha"
  "libraries/errors/ReCaptchaError"
]
Middleware["@singleton"] = true