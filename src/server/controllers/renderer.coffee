jade = require "jade"
_ = require "underscore"


###*
 * A helper module which returns a function used to render the page properly
 * with the right parameters and some default values.
 *
 * This module introduces in-memory cache to avoid having jade to recompile
 * redundant HTML and also introduces alot of custom variables that are also
 * exposed to the compiler.
 *
 * For a better understanding about how to use this module see the documentation
 * of the function that gets returned below.
 *
 * @author Steven Enamakel <me@steven.pw>
###
exports = module.exports = (settings, Cache) ->
  defaults =
    _: global.__
    lang: "en"

    data: {}
    environment: settings.server.env
    settings: settings
    staticUrl: settings.staticUrl
    url: settings.url
    cache: {}

    publicData:
      environment: settings.server.env
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


  ###*
   * TODO: Write this...
   *
   *
   * @param  {[type]} request            [description]
   * @param  {[type]} response           [description]
   * @param  {[type]} options            [description]
  ###
  (request, response, options={}) ->
    # Setup the cache variables
    cacheKey = "never-set"
    if options.cache?
      cacheEnable = true
      cacheKey = "renderer@#{options.cache.key}"
      cacheTimeout = options.timeout

    # # ScacheTimeout language
    # options.lang = request.getLocale()
    # options.lang = "en"
    if options.lang == "ar" then options.dir = "rtl"

    # Set the MD5 variables into the publicData field
    options.publicData ?= {}
    options.publicData.md5 = settings.md5 or {}

    # Everything has been set so now check the cache for the HTML of this page
    Cache.get cacheKey

    # If there was nothing found in the cache, then start the compilation
    # procedures.
    .catch ->
      # Setup options for the jade compiler and HTML compiler
      jadeOptions =
        cache: cacheEnable
        pretty: defaults.environment is "development"
      htmlOptions = _.extend defaults, options

      # Compile and render the page
      viewURL = "#{settings.views.dir}/main/#{options.page}.jade"
      fn = jade.compileFile viewURL, jadeOptions
      html = fn htmlOptions

      # Now that we have compiled the HTML, we decide if we want to cache it or
      # not. Note that these function return a promise which then resolves to
      # the HTML code..
      if cacheTimeout then Cache.set cacheKey, html, cacheTimeout
      else if cacheEnable then Cache.set cacheKey, html
      else html

    # Finally write to the response!
    .then (html) ->
      response.header "Content-Type", "text/html; charset=utf-8"
      response.end html


exports["@require"] = [
  "igloo/settings"
  "controllers/cache"
]
exports["@singleton"] = true
