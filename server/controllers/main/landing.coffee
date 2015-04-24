async = require 'async'

# Description for the meta tag
description = 'Publish and Browse classifieds in Kuwait. Quick, easy and absolutely free! Jobs, property, real estate, cars and classifieds in Kuwait. Post an ad, browse ads, buy, sell or rent.'

# Controller for the landing page. Displays the front-page with the top
# classifieds and categories to choose from.
exports = module.exports = (renderer) ->

  app = this
  this.get = (request, response, next) ->
    # if request.cookies['pay-w-tweet']
    #   async.parallel [=> controller.promoteClassified request]

    args =
      description: description
      page: 'landing'
      # title: response.__ 'title.landing'

    renderer request, response, args, true

exports['@require'] = [ 'controllers/renderer.coffee' ]
exports['@singleton'] = true

  # langRedirect: (request, response, next) ->
  #   if not request.cookies['l'] then response.cookie 'l', request.getLocale()
  #   response.setLocale request.cookies['l']
  #   response.redirect "/#{request.getLocale()}#{request.url}"


  # setLanguage: (request, response, next) ->
  #   response.cookie 'l', request.params[0]
  #   response.setLocale request.params[0]
  #   next()


  # promoteClassified: (request) ->
  #   id = request.cookies['pay-w-tweet']
  #   authHash = request.cookies['authHash']
  #   Classified = global.models.classified
  #   Classified.perks.promote id, authHash, request.user

  #   userid = (request.user or {})._id or "anonymous"

  #   # Send an email to admin notifying
  #   Email = global.modules.email
  #   message = "#{userid} shared and promoted classified with id:#{id}"
  #   Email.send 'pay-with-tweet success', 'stevent95@gmail.com', message

  #   logger = global.modules.logger
  #   logger request, message