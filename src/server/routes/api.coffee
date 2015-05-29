express   = require "express"


exports = module.exports = (IoC) ->
  app = this
  router = express.Router()

  DELETE = 0
  GET = 1
  PATCH = 2
  POST = 3
  PUT = 4

  _r = (url, controller, method=GET) ->
    _api = (controller) -> IoC.create "controllers/api/#{controller}"
    switch method
      when POST
        router.post   (new RegExp "^#{url}/?$"), _api "#{controller}/post"
      when PUT
        router.put    (new RegExp "^#{url}/?$"), _api "#{controller}/put"
      when DELETE
        router.delete (new RegExp "^#{url}/?$"), _api "#{controller}/delete"
      when GET
        router.get    (new RegExp "^#{url}/?$"), _api "#{controller}/get"

  _r "",                                     ".",                         GET
  _r "/auth/email",                          "auth/email",                PUT
  _r "/auth/email/activate/([0-9]+)",        "auth/email/activate",       GET
  _r "/auth/email/login",                    "auth/email/login",          POST
  _r "/auth/email/signup",                   "auth/email/signup",         POST
  _r "/auth/logout",                         "auth/logout",               GET
  _r "/categories",                          "categories",                GET
  _r "/categories/counters",                 "categories/counters",       GET
  _r "/classifieds",                         "classifieds",               GET
  _r "/classifieds",                         "classifieds",               POST
  _r "/classifieds/([0-9]+)",                "classifieds/id",            DELETE
  _r "/classifieds/([0-9]+)",                "classifieds/id",            GET
  _r "/classifieds/([0-9]+)",                "classifieds/id",            PUT
  _r "/classifieds/([0-9]+)/(next|prev)",    "classifieds/id/next-prev",  GET
  _r "/classifieds/([0-9]+)/prev",           "classifieds/id/prev",       GET
  _r "/classifieds/slug/([^/]+)",            "classifieds/slug",          GET
  _r "/lang/([a-z]+)",                       "lang",                      GET
  _r "/locations",                           "locations",                 GET
  _r "/messages/classified",                 "messages/classified",       POST
  _r "/messages/contact",                    "messages/contact",          POST
  _r "/users/([0-9]+)?",                     "users",                     DELETE
  _r "/users/([0-9]+)?",                     "users",                     GET
  _r "/users/([0-9]+)?",                     "users",                     PATCH
  _r "/users/([0-9]+)?",                     "users",                     PUT
  _r "/users/current",                       "users/current",             GET
  # _r "/payments",                     "payments", GET
  # _r "/payments/callback",            "payments/callback", GET

  app.use "/api", router


exports["@require"] = ["$container"]
exports["@singleton"] = true
