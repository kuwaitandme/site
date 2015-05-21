Promise        = require "bluebird"
_              = require "underscore"
https          = require "https"
querystring    = require "querystring"


exports = module.exports = (IoC, settings) ->
  logger = IoC.create "igloo/logger"

  API_END_POINT = "/api/recaptcha/siteverify"
  API_HOST      = "www.google.com"
  siteKey       = settings.reCaptcha.siteKey
  siteSecret    = settings.reCaptcha.secret

  # A helper function to send a call to the reCaptcha API. This function calls
  # the callback with the result of the captcha validation.
  _callAPI = (APIdata, callback) ->
    dataToSend =
      remoteip: APIdata.remoteip
      response: APIdata.response
      secret: siteSecret
    # Generate the query string.
    data_qs = querystring.stringify data
    # Prepare the request parameters which we will send to the Google reCaptcha.
    req_options =
      host: API_HOST
      method: "POST"
      path: API_END_POINT
      port: 443
      headers:
        "Content-Length" : data_qs.length
        "Content-Type"   : "application/x-www-form-urlencoded"
    # Finally, send the request to the API
    request = https.request req_options, (response) ->
      body = ""
      response.on "data", (chunk) -> body += chunk
      response.on "error", -> callback "recaptcha-not-reachable"
      response.on "end", ->
        result = JSON.parse body
        if result.success then callback()
        else callback result["error-codes"]
    request.write data_qs, "utf8"
    request.end()


  new class
    # This is a function that returns a Promise function. It returns back the
    # request if the captcha successfully validated. It throws an error if
    # the captcha failed.
    verify: (request) ->
      new Promise (resolve, reject) =>
        logger.debug "checking reCaptcha"
        if not settings.reCaptcha.enabled then return resolve request

        # Get the ip and the user's captcha response.
        remoteIP = request.connection.remoteAddress
        captchaData = request.query.captcha or
          request.body["g-recaptcha-response"] or
          request.headers["x-gcaptcha"]
        # Prepare the data to be sent to the API
        APIdata = remoteip: remoteIP, response: captchaData

        # Send the request to the Google reCaptcha API
        _callAPI APIdata, (error) ->
          if error then reject "captcha failed"
          resolve request



exports["@singleton"] = true
exports["@require"] = [
  "$container"
  "igloo/settings"
]