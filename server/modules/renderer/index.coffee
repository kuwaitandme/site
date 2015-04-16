jade = require 'jade'

# A helper function to render the page properly with the right parameters and
# some default values.
module.exports = (request, response, args={}, cache=false) ->
  # First generate the page's bodyid. This is what we will use for adding
  # the right CSS as well as the key used for caching the page.
  args.bodyid = args.page.replace '/', '-'

  cacheId = "page:#{request.getLocale()}:#{args.bodyid}"

  response.header "Content-Type", "text/html; charset=utf-8"

  # Render the page. This function is responsible for setting up all the
  # variables properly as well as saving the view into the cache if needed
  render = (cacheError) ->
    if cacheError then throw err

    # Setup options for the page
    config = global.config
    args.environment = config.mode
    args._ =  global.__


    args.lang = request.getLocale()
    if args.lang == 'ar' then args.dir = 'rtl'

    args.title = "#{args.title} - Kuwait and Me"

    args.mode = global.config.mode
    args.data = args.data or {}
    args.data.captchaKey = config.reCaptcha.site
    args.config =
      mode: config.mode
      magic: config.magic
      ga: config.ga
      reCaptcha: config.reCaptcha.site
      # TCO:
        # sid: config._2checkout.sid
        # publicKey: config._2checkout.publicKey
        # sandbox: config._2checkout.sandbox

    args.robots = args.data
    args.data = (new Buffer JSON.stringify args.data).toString 'base64'
    # args.data.csrf = csrfToken

    # Setup options for the jade compiler
    isDevelopment = global.config.mode == 'development'
    options =
      cache: not isDevelopment
      pretty: isDevelopment

    # Compile and render the page
    fn = jade.compileFile "#{global.root}/views/main/#{args.page}.jade", options
    html = fn args

    # If we are caching this page, then set it into the cache
    if cache and isDevelopment then global.cache.set cacheId, html

    # Return the page
    response.end html

  # If we are looking in our cache, then try to find the view in the cache
  if cache

    # Get the value from the cache
    global.cache.get cacheId, (error, result) ->
      if error then render error

      # If the cache was found, then return it
      if result then response.end result
      # Else re-render the page and then save it into the cache
      else render null

  # Render the page if we are not looking in the cache
  else render null