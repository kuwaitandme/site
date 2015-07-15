express   = require "express"


exports = module.exports = (IoC) ->
  app = this
  router = express.Router()

  # These variable are only used to initialize the route. The number are used to
  # uniquely identify them in the switch statement in the function below.
  DELETE = 0
  GET = 1
  PATCH = 2
  POST = 3
  PUT = 4

  ###*
   * A helper function to initialize API routes. Because we want to avoid
   * repetitive code, we use this function which shorten down things to nice
   * clean statements.
   *
   *
   * @param  String url           A regular expression string that matches the
   *                              route
   * @param  String controller    Local path of the api's controller (relative
   *                              from the /controllers/api folder).
   * @param  Number method        A number representing the type of request we
   *                              should use.
  ###
  r = (url, controller, method=GET) ->
    api = (controller) -> IoC.create "controllers/api/#{controller}"
    switch method
      when POST
        router.post   (new RegExp "^#{url}/?$"), api "#{controller}/post"
      when PUT
        router.put    (new RegExp "^#{url}/?$"), api "#{controller}/put"
      when DELETE
        router.delete (new RegExp "^#{url}/?$"), api "#{controller}/delete"
      when GET
        router.get    (new RegExp "^#{url}/?$"), api "#{controller}/get"

  # r "",                                     ".",                         GET
  # r "/auth/email",                          "auth/email",                PUT
  # r "/auth/email/activate/([0-9]+)",        "auth/email/activate",       GET
  # r "/auth/email/login",                    "auth/email/login",          POST
  # r "/auth/email/signup",                   "auth/email/signup",         POST
  # r "/auth/logout",                         "auth/logout",               GET
  # r "/categories",                          "categories",                GET
  # r "/categories/counters",                 "categories/counters",       GET
  # r "/csrf",                                "csrf",                      GET
  # r "/logs",                                "logs",                      GET
  r "/forums/topics",                       "forums/topics",             GET
  # r "/lang/([a-z]+)",                       "lang",                      GET
  # r "/locations",                           "locations",                 GET
  # r "/messages/classified/([0-9]+)?",       "messages/classified",       POST
  # r "/messages/contact",                    "messages/contact",          POST
  # r "/notifications",                       "notifications",             GET
  # r "/notifications/read",                  "notifications/read",        GET
  # r "/sharing",                             "sharing",                   GET
  # r "/sharing",                             "sharing",                   POST
  # r "/sharing/([0-9]+)",                    "sharing/id",                DELETE
  # r "/sharing/([0-9]+)",                    "sharing/id",                GET
  # r "/sharing/([0-9]+)",                    "sharing/id",                PUT
  # r "/sharing/([0-9]+)/(next|prev)",        "sharing/id/next-prev",      GET
  # r "/sharing/([0-9]+)/prev",               "sharing/id/prev",           GET
  # r "/sharing/slug/([^/]+)",                "sharing/slug",              GET
  r "/users",                               "users",                     GET
  # r "/users/([0-9]+)?",                     "users",                     DELETE
  r "/users/([0-9]+)?",                     "users/id",                  GET
  # r "/users/([0-9]+)?",                     "users",                     PATCH
  # r "/users/([0-9]+)?",                     "users",                     PUT
  # r "/users/current",                       "users/current",             GET

  app.use "/api", router


exports["@require"] = ["$container"]
exports["@singleton"] = true
