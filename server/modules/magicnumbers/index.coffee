fs    = require 'fs'
async = require 'async'

module.exports = (app) ->
  root = "#{global.root}/../public"

  buildDirs = [
    "#{root}/javascripts/build/"
    "#{root}/stylesheets/build/"
  ]

  libraryDirs = [
    "#{root}/javascripts/vendor/"
    "#{root}/stylesheets/vendor/"
  ]

  modelDirs = [
    "#{global.root}/db/"
  ]

  calculateMagicFromDirectory = (dirs, callback) ->
    files = []
    for dir in dirs
      tmpFiles = fs.readdirSync dir
      files.push "#{dir}#{file}" for file in tmpFiles

    magic = 0
    calculateMagic = (file, finish) ->
      fs.stat file, (error, stats) ->
        if error then return finish() #error
        magic = (magic + stats.size) % 100000
        finish()

    async.each files, calculateMagic, (error) -> callback error, magic

  resetApplicationMagic = ->
    calculateMagicFromDirectory buildDirs, (error, magic) ->
      console.log 'reseted application magic to:', magic
      config.magic.application = magic.toString()
      cache.clear()

  resetLibraryMagic = (event, file) ->
    calculateMagicFromDirectory libraryDirs, (error, magic) ->
      console.log 'reseted library magic to:', magic
      config.magic.library = magic.toString()
      cache.clear()

  resetModelMagic = (event, file) ->
    calculateMagicFromDirectory modelDirs, (error, magic) ->
      console.log 'reseted model magic to:', magic
      config.magic.models = magic.toString()
      cache.clear()

  for dir in buildDirs
    try fs.watch dir, resetApplicationMagic
    catch e then console.log e

  for dir in libraryDirs
    try fs.watch dir, resetLibraryMagic
    catch e then console.log e

  for dir in modelDirs
    try fs.watch dir, resetModelMagic
    catch e then console.log e

  config.magic = {}
  resetLibraryMagic()
  resetApplicationMagic()
  resetModelMagic()