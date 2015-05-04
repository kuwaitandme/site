fs = require "fs"


###
This function returns a JSON of all the strings for the given language. The
language is specified in the URL as shown below.

GET /api/lang/en

@method api.lang.get
@return JSON
###
exports = module.exports = (settings) ->
  controller = (request, response, next) ->
    response.contentType "application/json"
    lang = request.params.id

    # Check if language is valid
    if not /(en|ar|dg)/.test lang
      response.status 404
      return response.end '"Language not found"'

    # Read from the language file
    fs.readFile "#{settings.appDir}/locales/#{lang}.json", "utf8",
      (error, data) ->
        if (error) then next error
        else response.end data


exports["@require"] = ["igloo/settings"]
exports["@singleton"] = true