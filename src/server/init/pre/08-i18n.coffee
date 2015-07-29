###
  Internationalization
  ====================

  This module is responsible for adding i18n support to the app. We generate all
  the JSON files from the `locales` directory and initialize the i18n middleware
  with the app.
###

i18n    = require "i18n"
fs      = require "fs"
path    = require "path"
walk    = require "fs-walk"
_       = require "underscore"


exports = module.exports = (IoC, settings) ->
  defaultJson = null
  logger = IoC.create "igloo/logger"
  logger.verbose "[init] configuring i18n middleware"

  settings.localeDest = "#{settings.appDir}/locales/.generated"

  ###
    ## defaultLocale
    We keep a language with all the variables translated properly. We
    call this the default language. All other languages will extend keys
    from this language if they have not been defined.

    Note that the default locale must be generated first, so that other
    languages can get something to derive missing keys from.
  ###
  defaultLocale = "en"


  ###
    ## generateLocale
    This function is used to generate a JSON file for the given locale.

    Normally, using i18n we would have to put all our key:value pairs in one
    JSON file which becomes heavy if the file grows too big. So this function
    recursively reads through a folder and combines all the JSON in it's files
    to create a single json with all the keys being unique. The generated keys
    will look like this
    ```
    {
      "relative-path:key-in-file" : "value-of-key-in-file"
      "news/index:title" : "This is the news page"
    }
    ```
    @param {String} locale       A two letter slug of the locale to initialize.
  ###
  generateLocale = (locale="en") ->
    walkPath = "#{settings.appDir}/locales/#{locale}"
    obj = {}

    # Start walking and look for the test files
    walk.walkSync walkPath, (basedir, filename, stat) ->
      # Get the relative and absolute paths
      absolutePath = path.join basedir, filename
      relativePath = absolutePath.split(walkPath)[1]

      # Check if the file matched was a JSON file or not.
      results = relativePath.match /\/(.+).json/

      # If it was then create the slug, else exit.
      if not results? then return
      else slug = results[1]

      # Read the JSON from the file
      json = require absolutePath

      # Append the path to each of the json keys.
      obj["#{slug}:#{key}"] = json[key] for key of json

    # Apply or set the default language.
    if defaultLocale == locale then defaultJson = obj
    else if defaultJson? then  _.extend obj, defaultJson

    # Stringify JSON and write to the file.
    json = JSON.stringify obj, null, 2
    fs.writeFile "#{settings.localeDest}/#{locale}.json", json, (err) ->
      if err then return logger.error err
      logger.verbose "generated #{locale}.json"


  # Finally use our helper function and generate our different locales here.
  generateLocale "en"
  generateLocale "ar"

  # Configure i18n now.
  i18n.configure
    cookie: "l"
    defaultLocale: defaultLocale
    directory: settings.localeDest
    locales: [
      "en"
      "ar"
      "dg"
    ]
  global.__ = i18n.__

  # Add the middleware into the app!
  app = this
  app.use i18n.init


exports["@require"] = [
  "$container"
  "igloo/settings"
]
exports["@singleton"] = true
