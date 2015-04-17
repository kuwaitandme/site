async = require 'async'

# Description for the meta tag
description = 'Publish and Browse classifieds in Kuwait. Quick, easy and absolutely free! Jobs, property, real estate, cars and classifieds in Kuwait. Post an ad, browse ads, buy, sell or rent.'

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

    render = global.modules.renderer
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

    userid = (request.user or {})._id or "anonymous"

    # Send an email to admin notifying
    Email = global.modules.email
    message = "#{userid} shared and promoted classified with id:#{id}"
    Email.send 'pay-with-tweet success', 'stevent95@gmail.com', message

    logger = global.modules.logger
    logger request, message


  # None of the URL matched, so return 404
  fourofour: (request, response, next) ->
    error = new Error 'Not Found'
    error.status = 404
    next error


  routes: (router) ->
    localizedUrl = (url) -> new RegExp "^/(?:ar|en|dg)#{url}/?$"

    router.get /^\/(ar|en|dg).*\/?$/, @setLanguage
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
    router.get /^(?:[^aed]|a[^r]|e[^n]|d[^g])(.*)/, @langRedirect