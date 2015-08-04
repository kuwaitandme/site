jade = require "jade"
_    = require "underscore"


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
   * @param  {[type]} request            [description]
   * @param  {[type]} response           [description]
   * @param  {[type]} options            [description]
  ###
  renderer = (request, response, options={}) ->
    # Setup the cache variables
    cacheKey = "never-set"
    if options.cache?
      cacheEnable = true
      cacheKey = "renderer@#{options.cache.key}"
      cacheTimeout = options.timeout

    # # Set the language options
    # options.lang = request.getLocale()
    if options.lang == "ar" then options.dir = "rtl"

    # Everything has been set so now check the cache for the HTML of this page
    Cache.get cacheKey

    # If there was nothing found in the cache, then start the compilation
    # procedures.
    .catch ->
      if request.query.json? then return options.data

      # Give the default page title
      options.title ?= response.__ "#{options.page}:title"

      # Setup options for the jade compiler and HTML compiler
      jadeOptions =
        cache: cacheEnable
        pretty: defaults.environment is "development"
      htmlOptions = _.extend defaults, options or {}

      ###
        Set the MD5 variables into the publicData field. We set this value
        here because underscore doesn't support deep extends and the MD5 value
        is something that changes often so it is not recommended keep it in the
        defaults section (which remains static) nor pass it through the options
      ###
      htmlOptions.publicData.md5 = settings.md5 or {}

      viewURL = "#{settings.views.dir}/main/#{options.page}.jade"
      fn = jade.compileFile viewURL, jadeOptions or {}
      html = fn htmlOptions or {}

      ###
        Now that we have compiled the HTML, we decide if we want to cache it or
        not.

        Note that these function return a promise which then resolves to
        the HTML code, so the next promise function will definitely receive
        HTML one way or the other
      ###
      if cacheTimeout then return Cache.set cacheKey, html, cacheTimeout
      else if cacheEnable then return Cache.set cacheKey, html
      else return html


    # Finally write to the response!
    .then (data) ->
      if request.query.json? then response.json data
      else
        response.header "Content-Type", "text/html; charset=utf-8"
        response.end data


exports["@require"] = [
  "igloo/settings"
  "libraries/cache"
]
exports["@singleton"] = true
