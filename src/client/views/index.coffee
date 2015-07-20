module.exports = (app) ->
  console.log "[services] initializing"

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
    "forums": require "./forums/controller"
    "index": require "./index/controller"
    "info/contact": require "./info/contact/controller"
    "info/donate": require "./info/donate/controller"
    "news": require "./news/controller"
    "news/create": require "./news/create/controller"
    "stories": require "./stories/controller"
    "users/single": require "./users/single/controller"
    # "account/credits": require "./account/credits/controller"
    # "classified/category": require "./classified/category/controller"
    # "classified/create": require "./classified/create/controller"
    # "classified/finish": require "./classified/finish/controller"
    # "classified/search": require "./classified/search/controller"
    # "classified/single": require "./classified/single/controller"
    # "info/about": require "./info/about/controller"
    # "info/terms-privacy": require "./info/terms-privacy/controller"



  app.controller c, controllers[c] for c of controllers
