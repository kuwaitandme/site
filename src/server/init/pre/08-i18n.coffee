i18n    = require "i18n"
fs      = require "fs"
path    = require "path"
walk    = require "fs-walk"


exports = module.exports = (IoC, settings) ->
  logger = IoC.create "igloo/logger"
  logger.verbose "[init] configuring i18n middleware"

  localeDest = "#{settings.appDir}/locales/.generated"

  generateLocale = (locale="en") ->
    walkPath = "#{settings.appDir}/locales/#{locale}"
    obj = {}

    # Start walking and look for the test files
    walk.walkSync walkPath, (basedir, filename, stat) ->
      # Get the relative and absolute paths
      absolutePath = path.join basedir, filename
      relativePath = absolutePath.split(walkPath)[1]

      # Check if the file matched was a JSON file or not. If it was then create
      # the slug, else exit.
      results = relativePath.match /\/(.+).json/
      if not results? then return
      else slug = results[1]

      # Read the JSON from the file
      json = require absolutePath

      # Append the path to each of the json keys.
      obj["#{slug}:#{key}"] = json[key] for key of json

    # Stringify JSON and write to the file.
    json = JSON.stringify obj, null, 2
    fs.writeFile "#{localeDest}/#{locale}.json", json, (err) ->
      if err then return logger.error err
      logger.verbose "generated locale/#{locale}.json"



  generateLocale "en"
  generateLocale "ar"



  i18n.configure
    cookie: "l"
    defaultLocale: "en"
    directory: localeDest
    locales: [
      "en"
      "ar"
      "dg"
    ]
  global.__ = i18n.__

  app = this
  app.use i18n.init

exports["@require"] = [
  "$container"
  "igloo/settings"
]
exports["@singleton"] = true
