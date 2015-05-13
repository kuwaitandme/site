express   = require "express"


exports = module.exports = (IoC) ->
  app = this
  router = express.Router()

  _api = (controller) -> IoC.create "controllers/api/#{controller}"

  router.get    "/",                         _api ""
  router.get    "/categories",               _api "categories/get"
  router.get    "/categories/counters",      _api "categories/counters/get"
  router.get    "/locations",                _api "locations/get"
  router.get    "/lang/:id",                 _api "lang/get"

  router.post   "/messages/classified",      _api "messages/classified/post"
  router.post   "/messages/contact",         _api "messages/contact/post"

  router.get    "/auth/logout",              _api "auth/logout/get"
  router.get    "/auth/email/activate/:id?", _api "auth/email/activate/get"
  router.post   "/auth/email/login",         _api "auth/email/login/post"
  router.post   "/auth/email/signup",        _api "auth/email/signup/post"
  router.put    "/auth/email",               _api "auth/email/put"

  router.delete "/classifieds/:id?",         _api "classifieds/delete"
  router.get    "/classifieds/slug/:slug?",  _api "classifieds/slug/get"
  router.get    "/classifieds/:id?",         _api "classifieds/get"
  router.patch  "/classifieds/:id?",         _api "classifieds/patch"
  router.post   "/classifieds/:id?",         _api "classifieds/post"
  router.put    "/classifieds/:id?",         _api "classifieds/put"

  router.get    "/users/current",            _api "users/current/get"
  router.delete "/users/:id?",               _api "users/delete"
  router.get    "/users/:id?",               _api "users/get"
  router.put    "/users/:id?",               _api "users/put"
  router.patch  "/users/:id?",               _api "users/patch"

  app.use "/api", router


exports["@require"] = ["$container"]
exports["@singleton"] = true
