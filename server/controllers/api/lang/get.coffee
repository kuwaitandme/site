fs = require "fs"


###
This function returns a JSON of all the strings for the given language. The
language is specified in the URL as shown below.

GET /api/lang/en

@method api.lang.get
@return JSON
###
exports = module.exports = (settings, cache) ->
  controller = (request, response, next) ->
    response.contentType "application/json"
    lang = request.params.id

    # Check if language is valid
    if not /(en|ar|dg)/.test lang
      response.status 404
      return response.json "Language not found"

    # Check in cache
    cache.get "route:api/lang/#{lang}", (error, results) =>
      if results then return response.end results

      # Categories was not cached, so query and then save in cache
      fs.readFile "#{settings.appDir}/locales/#{lang}.json", "utf8",
      (error, data) ->
        cache.set "route:api/lang/#{lang}", data
        response.end data


exports["@require"] = [
  "igloo/settings"
  "controllers/cache"
]
exports["@singleton"] = true