module.exports = (app) ->
  controllers =
    "account": require "./account/controller"
    "account/classifieds": require "./account/classifieds/controller"
    "account/classifieds/single": require "./account/classifieds/single/controller"
    "account/moderate": require "./account/moderate/controller"
    "account/moderate/single": require "./account/moderate/single/controller"
    "auth": require "./auth/controller"
    "auth/login": require "./auth/login/controller"
    "auth/logout": require "./auth/logout/controller"
    "auth/signup": require "./auth/signup/controller"
    "error/404": require "./error/404/controller"
    "index": require "./index/controller"
    "users/single": require "./users/single/controller"
    # "account/credits": require "./account/credits/controller"
    # "info/about": require "./info/about/controller"
    # "info/terms-privacy": require "./info/terms-privacy/controller"

  app.controller c, controllers[c] for c of controllers
