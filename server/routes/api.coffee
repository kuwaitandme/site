express   = require "express"


exports = module.exports = (IoC) ->
  app = this
  router = express.Router()

  _api = (controller) -> IoC.create "controllers/api/#{controller}"

  router.get    "/",          _api ""

  router.get    "/category",           _api "category/get"
  router.get    "/category/counters",  _api "category/counters/get"
  router.get    "/location",           _api "location/get"

  router.get    "/lang/:id",           _api "lang/get"
  router.post   "/query",              _api "query/post"

  # router.post   "/contact",            _api "contact/post"

  router.get    "/auth/email/activate/:id?", _api "auth/email/activate/get"
  router.post   "/auth/email/login",         _api "auth/email/login/post"
  router.post   "/auth/email/signup",        _api "auth/email/signup/post"
  router.put    "/auth/email",               _api "auth/email/put"
  router.get    "/auth/logout",              _api "auth/logout/get"

  # router.get    "/auth/yahoo",          passport.authenticate 'yahoo'
  # router.get    "/auth/yahoo/callback", passport.authenticate 'yahoo',
  #   successRedirect: '/account'
  #   failureRedirect: '/auth/login?error=yahoo_failed'

  # router.delete "/classified/:id?",     _api "classified/delete"
  router.get    "/classified/slug/:slug?",   _api "classified/slug/get"
  router.get    "/classified/:id?",          _api "classified/get"
  router.patch  "/classified/:id?",          _api "classified/patch"
  router.post   "/classified/:id?",          _api "classified/post"
  router.put    "/classified/:id?",          _api "classified/put"

  router.get    "/user/current",             _api "user/current/get"
  router.get    "/user/:id?",                _api "user/get"
  # router.post   "/user/",     _api "user/post"
  # router.put    "/user/:id?", _api "user/put"

  app.use "/api", router


exports["@require"] = [ "$container" ]
exports["@singleton"] = true
