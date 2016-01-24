Ouch = require "ouch"

Controller = module.exports = (settings) ->
  ouchInstance = (new Ouch).pushHandler (
    new (Ouch.handlers.PrettyPageHandler)('orange', null, 'sublime'))

  (error, request, response, next) ->
    response.status error.status or 500
    isProduction = settings.server.env == "production"

    #! For API request just return a JSON version of the message
    if request.url.indexOf("/api") > -1 and isProduction
      return response.json error: error.message

    #! Redirect 401s to the login page..
    if error.status is 401
      redirectUrl = encodeURIComponent request.url
      finalUrl = "/login?_success=login_needed&redirectTo=#{redirectUrl}"
      return response.redirect finalUrl

    #! Redirect 404s to the not found page..
    if error.status is 404
      return response.render "main/errors/404",
        title: "Page not found"
        data:
          error: error
          message: error.message
          status: error.status

    #! In production, no stack-traces leaked to user
    if isProduction then error.stack = null

    #! In development, display the error on console
    else return ouchInstance.handleException error, request, response




    response.render "main/errors/5XX",
      page: "errors/5XX"
      title: "Something freaky happened!"
      data:
        error: error
        message: error.message
        status: error.status or 500


Controller["@require"] = ["igloo/settings"]
Controller["@singleton"] = true