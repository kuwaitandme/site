Promise = require "bluebird"
fs      = Promise.promisifyAll require "fs"


###
This function returns a JSON of all the strings for the given language. The
language is specified in the URL as shown below.

```
GET /api/language/en
```
###
exports = module.exports = (settings, Cache) ->
  routes: ["/language/([a-z]+)"]

  controller: (request, response, next) ->
    response.contentType "application/json"
    lang = request.params[0]

    # Check if language is valid
    if not /(en|ar|dg)/.test lang
      response.status 404
      return response.json "language not found"

    #! Check in cache
    Cache.get "route:api/lang/#{lang}"

    #! Language was not cached, so query and then save in cache
    .catch ->
      fs.readFileAsync "#{settings.localeDest}/#{lang}.json"
      .then (data) -> Cache.set "route:api/lang/#{lang}", data.toString()

    .then (results) -> response.end results
    .catch (e) ->  next e


exports["@require"] = [
  "igloo/settings"
  "libraries/cache"
]
exports["@singleton"] = true