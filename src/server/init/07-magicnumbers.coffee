async   = require "async"
fs      = require "fs"
md5     = require "MD5"
md5File = require "md5-file"

exports = module.exports = (IoC, settings, cache) ->
  logger = IoC.create "igloo/logger"
  publicDir = settings.publicDir
  modelsDir = settings.modelsDir

  buildPaths = [
    "#{publicDir}/javascripts/app.js"
    "#{publicDir}/javascripts/templates.js"
    "#{publicDir}/stylesheets/style.css"
  ]

  libraryPaths = ["#{publicDir}/javascripts/libraries.js"]

  modelPaths = [
    "#{modelsDir}/migrations"
    "#{modelsDir}/seeds"
  ]

  _calculateMagic = (paths, callback) ->
    files = []
    for path in paths
      isDir = (fs.lstatSync path).isDirectory()
      # console.log path, isDir
      if isDir
        tmpFiles = fs.readdirSync path
        files.push "#{path}/#{file}" for file in tmpFiles
      else files.push path

    # Map each file into the md5file, which generates md5-checksums for each
    # file.
    async.map files, md5File, (error, sums) ->
      if error then callback error
      # Concatenate all the md5 sums
      newBadSum = ""
      newBadSum += sum for sum in sums
      finalMd5 = md5 newBadSum
      # Return the new MD5 checksum
      callback null, finalMd5

  _resetMagic = (paths, key) ->
    _calculateMagic paths, (error, magic) ->
      logger.debug "setting #{key} magic to: #{magic}"
      settings.magic[key] = magic
      cache.clear

  resetApplicationMagic = -> _resetMagic buildPaths, "application"
  resetLibraryMagic = -> _resetMagic libraryPaths, "library"
  resetModelMagic = -> _resetMagic modelPaths, "models"

  for dir in buildPaths
    try fs.watch dir, resetApplicationMagic
    catch e then console.log e

  for dir in libraryPaths
    try fs.watch dir, resetLibraryMagic
    catch e then console.log e

  for dir in modelPaths
    try fs.watch dir, resetModelMagic
    catch e then console.log e

  settings.magic ?= {}
  resetApplicationMagic()
  resetLibraryMagic()
  resetModelMagic()


exports["@require"] = [
  "$container"
  "igloo/settings"
  "controllers/cache"
]
exports["@singleton"] = true