jade = require 'jade'


# A helper function to render the page properly with the right parameters and
# some default values.
module.exports = (request, response, args={}, cache=false) ->
  # First generate the page's bodyid. This is what we will use for adding
  # the right CSS as well as the key used for caching the page.
  args.bodyid = args.page.replace '/', '-'

  # Render the page. This function is responsible for setting up all the
  # variables properly as well as saving the view into the cache if needed
  render = (redisError) ->
    if redisError then throw err

    # Setup options for the page
    config = global.config
    args.environment = config.mode
    args._ =  global.__

    args.title = "#{args.title} | Kuwait and Me"

    args.data = args.data or {}
    args.data.captchaKey = config.reCaptcha.site
    args.data.js = config.js
    args.data.ga = config.ga
    # args.data.user = request.user

    args.robots = args.data
    args.data = (new Buffer JSON.stringify args.data).toString 'base64'
    # args.data.csrf = csrfToken

    isDevelopment = global.config.mode != 'production'
    # Setup options for the jade compiler
    options =
      cache: not isDevelopment
      pretty: isDevelopment

    # Compile and render the page
    fn = jade.compileFile "#{global.root}/views/main/#{args.page}.jade", options
    html = fn args

    # If we are caching this page, then set it into the cache
    if cache and isDevelopment then global.cache.set 'page:' + args.bodyid, html

    # Return the page
    response.end html

  # If we are looking in our cache, then try to find the view in the cache
  if cache
    # Get the value from the cache
    global.cache.get 'page:' + args.bodyid, (error, result) ->
      if error then render error

      # If the cache was found, then return it
      if result then response.end result
      # Else re-render the page and then save it into the cache
      else render null

  # Render the page if we are not looking in the cache
  else render null