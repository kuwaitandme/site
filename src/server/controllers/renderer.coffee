jade = require "jade"

# A helper function to render the page properly with the right parameters and
# some default values.
exports = module.exports = (settings, cache) ->
  fn = (request, response, options={}) ->
    # First generate the page's bodyid. This is what we will use for adding
    # the right CSS as well as the key used for caching the page.
    options.bodyid = options.page.replace /\//g, "-"

    # cacheId = "page:#{request.getLocale()}:#{options.bodyid}"
    cacheId = "page:en:#{options.bodyid}"

    response.header "Content-Type", "text/html; charset=utf-8"

    # Render the page. This function is responsible for setting up all the
    # variables properly as well as saving the view into the cache if needed
    render = (cacheError) ->
      if cacheError then throw err

      # Setup options for the page
      # options._ =  global.__

      # Set the language
      # options.lang = request.getLocale()
      options.lang = "en"
      if options.lang == "ar" then options.dir = "rtl"

      # Set the title!
      if options.title?
        options.title = "#{options.title} - #{settings.sitename}"
      else options.title = "#{settings.sitename}"

      options.environment = settings.server.env
      options.settings = settings
      options.staticUrl = settings.staticUrl
      options.url = settings.url

      options.data ?= {}
      options.publicData =
        environment: settings.server.env
        magic: settings.magic or {}
        staticUrl: settings.staticUrl
      options.cryptedData =
        facebook: clientid: settings.facebook.clientid
        google:
          analyticsCode: settings.google.analyticsCode
          clientID: settings.google.clientID
          reCaptchaKey: settings.google.reCaptcha
      # options.config =
        # mode: config.mode
        # magic: config.magic
        # ga: config.ga
        # reCaptcha: config.reCaptcha.site
        # TCO:
          # sid: config._2checkout.sid
          # publicKey: config._2checkout.publicKey
          # sandbox: config._2checkout.sandbox

      options.robots = options.data
      options.cryptedData = (new Buffer JSON.stringify options.cryptedData)
        .toString "base64"
      # options.data.csrf = csrfToken

      # Setup options for the jade compiler
      isDevelopment = options.environment == "development"
      jadeOptions =
        cache: not isDevelopment
        pretty: isDevelopment

      # Compile and render the page
      fn = jade.compileFile "#{settings.views.dir}/main/#{options.page}.jade", jadeOptions
      html = fn options

      # If we are caching this page, then set it into the cache
      if options.cachePage and isDevelopment then cache.set cacheId, html

      # Return the page
      response.end html

    # If we are looking in our cache, then try to find the view in the cache
    if options.cachePage

      # Get the value from the cache
      cache.get cacheId, (error, result) ->
        if error then render error

        # If the cache was found, then return it
        if result then response.end result
        # Else re-render the page and then save it into the cache
        else render null

    # Render the page if we are not looking in the cache
    else render null

exports["@require"] = [
  "igloo/settings"
  "controllers/cache"
]
exports["@singleton"] = true
