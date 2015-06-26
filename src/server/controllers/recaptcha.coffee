Promise        = require "bluebird"
_              = require "underscore"
https          = require "https"
querystring    = require "querystring"


exports = module.exports = (IoC, settings) ->
  logger = IoC.create "igloo/logger"
  name = "[reCaptcha]"

  API_END_POINT = "/recaptcha/api/siteverify"
  API_HOST      = "www.google.com"
  siteKey       = settings.google.reCaptcha.siteKey
  siteSecret    = settings.google.reCaptcha.siteSecret

  # A helper function to send a call to the reCaptcha API. This function returns
  # a Promise with the result of the captcha validation.
  callAPI = (APIdata) -> new Promise (resolve, reject) ->
    dataToSend =
      remoteip: APIdata.remoteip
      response: APIdata.response
      secret: siteSecret

    # Generate the query string.
    data_qs = querystring.stringify dataToSend

    # Prepare the request parameters which we will send to the Google reCaptcha.
    req_options =
      host: API_HOST
      method: "POST"
      path: API_END_POINT
      port: 443
      headers:
        "Content-Length": data_qs.length
        "Content-Type": "application/x-www-form-urlencoded"

    # Finally, send the request to the API
    request = https.request req_options, (response) ->
      body = ""
      response.on "data", (chunk) -> body += chunk
      response.on "error", -> reject new Error "recaptcha-not-reachable"
      response.on "end", ->
        result = JSON.parse body
        if result.success then resolve()
        else reject new Error result["error-codes"]
    request.write data_qs, "utf8"
    request.end()


  new class ReCaptcha
    # This is a function that returns a Promise function. It returns back the
    # request if the captcha successfully validated. It throws an error if
    # the captcha failed.
    verify: (request) ->
      logger.debug name, "checking captcha"
      # Disable re-captcha for now...
      if not settings.reCaptcha or true then return Promise.resolve request
      # if not settings.reCaptcha then return Promise.resolve request

      # Get the ip and the user's captcha response.
      remoteIP = request.connection.remoteAddress
      captchaData = request.query.captcha or
        request.body["g-recaptcha-response"] or
        request.headers["x-recaptcha"]

      # Prepare the data to be sent to the API
      APIdata = remoteip: remoteIP, response: captchaData

      # Send the request to the Google reCaptcha API
      callAPI APIdata
      .catch (error) ->
        logger.debug name, "captcha failed"
        throw error


exports["@singleton"] = true
exports["@require"] = [
  "$container"
  "igloo/settings"
]
