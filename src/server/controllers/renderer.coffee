jade = require "jade"
_ = require "underscore"

# A helper function to render the page properly with the right parameters and
# some default values.
exports = module.exports = (settings, Cache) ->
  defaults =
    _: global.__
    lang: "en"

    data: {}
    environment: settings.server.env
    settings: settings
    staticUrl: settings.staticUrl
    url: settings.url

    publicData:
      environment: settings.server.env
      magic: settings.magic or {}
      staticUrl: settings.staticUrl
      url: settings.url

    cryptedData:
      facebook:
        clientid: settings.facebook.clientid
      google:
        analyticsCode: settings.google.analyticsCode
        clientID: settings.google.clientID
        reCaptchaKey: settings.google.reCaptcha.siteKey

  # Base64 encode the crypted data key.. (it gets decoded in the client side,
  # but this just makes sure that bots don't fetch any sensitive info)..
  defaults.cryptedData = (new Buffer JSON.stringify defaults.cryptedData)
    .toString "base64"

  fn = (request, response, options={}, cache=false) ->

    # Setup the cache variables
    cacheKey = "page:#{options.page}"
    if cache
      cacheEnable = true
      if typeof cache is 'number' then cacheTTL = cache


    # # Set the language
    # options.lang = request.getLocale()
    # options.lang = "en"
    if options.lang == "ar" then options.dir = "rtl"

    # Now check in cache for the HTML of this page
    Cache.get cacheKey
    .catch ->
      # Setup options for the jade compiler and HTML compiler
      jadeOptions =
        cache: cacheEnable
        pretty: options.environment is "development"
      htmlOptions = _.extend defaults, options

      # Compile and render the page
      viewURL = "#{settings.views.dir}/main/#{options.page}.jade"
      fn = jade.compileFile viewURL, jadeOptions
      html = fn htmlOptions

    # Now that we have compiled the HTML, we decide if we want to cache it or
    # not.
    .then (html) ->
      if cacheTTL then Cache.set cacheKey, html, cacheTTL
      else if cacheEnable then Cache.set cacheKey, html
      else html

    .then (html) ->
      response.header "Content-Type", "text/html; charset=utf-8"
      response.end html


exports["@require"] = [
  "igloo/settings"
  "controllers/cache"
]
exports["@singleton"] = true
