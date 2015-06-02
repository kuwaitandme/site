module.exports = (app) ->
  console.log "[services] initializing"

  controllers =
    "index": require "./index/controller"

    "account": require "./account/controller"
    # "account/credits": require "./account/credits/controller"
    "account/manage": require "./account/manage/controller"

    "auth": require "./auth/controller"
    "auth/logout": require "./auth/logout/controller"

    "classified/edit": require "./classified/edit/controller"
    "classified/post": require "./classified/post/controller"
    "classified/finish": require "./classified/finish/controller"
    "classified/search": require "./classified/search/controller"
    "classified/single": require "./classified/single/controller"

    # "info/about": require "./info/about/controller"
    "info/contact": require "./info/contact/controller"
    "info/donate": require "./info/donate/controller"
    # "info/terms-privacy": require "./info/terms-privacy/controller"

    "error/404": require "./error/404/controller"

  app.controller c, controllers[c] for c of controllers
