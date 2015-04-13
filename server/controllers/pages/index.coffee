async = require 'async'

# Description for the meta tag
description = 'Publish and Browse classifieds in Kuwait. Quick, easy and absolutely free! Post your classified now and reach thousands'

# Controller for the landing page. Displays the front-page with the top
# classifieds and categories to choose from.
controller = module.exports =
  get: (request, response, next) ->
    if request.cookies['pay-w-tweet']
      async.parallel [=> controller.promoteClassified request]

    args =
      description: description
      page: 'landing'
      title: response.__ 'title.landing'

    render = global.helpers.render
    render request, response, args, true


  langRedirect: (request, response, next) ->
    if not request.cookies['l'] then response.cookie 'l', request.getLocale()
    response.setLocale request.cookies['l']
    response.redirect "/#{request.getLocale()}#{request.url}"


  setLanguage: (request, response, next) ->
    response.cookie 'l', request.params[0]
    response.setLocale request.params[0]
    next()


  promoteClassified: (request) ->
    id = request.cookies['pay-w-tweet']
    authHash = request.cookies['authHash']
    Classified = global.models.classified
    Classified.perks.promote id, authHash, request.user


  # None of the URL matched, so return 404
  fourofour: (request, response, next) ->
    error = new Error 'Not Found'
    error.status = 404
    next error


  routes: (router, base) ->
    localizedUrl = (url) -> new RegExp "^/(?:ar|en)#{url}/?$"

    router.get /^\/(ar|en).*\/?$/, @setLanguage
    router.get (localizedUrl ''), @get

    (require './about')         .routes router, localizedUrl
    (require './account')       .routes router, localizedUrl
    (require './auth')          .routes router, localizedUrl
    (require './classified')    .routes router, localizedUrl
    (require './contact')       .routes router, localizedUrl
    (require './guest')         .routes router, localizedUrl
    (require './terms-privacy') .routes router, localizedUrl

    # If language slug is present by page has not matched any url give 404 page
    router.get (localizedUrl '.*'), @fourofour

    # If language slug is missing and redirect to a preferred language
    router.get /^(?:[^ae]|a[^r]|e[^n])(.*)/, @langRedirect