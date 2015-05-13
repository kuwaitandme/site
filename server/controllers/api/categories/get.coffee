exports = module.exports = (Categories, cache, email) ->
  controller = (request, response, next) ->
    # email.send "testing", "stevent95@gmail.com", 'testing'
    # console.log
    # email.sendTemplate "stevent95@gmail.com", "temporaryCreatedUser",
    #   subject: "An account has been made for you"
    #   user: request.user
    response.contentType "application/json"
    # Check in cache
    cache.get "route:api/categories", (error, results) =>
      if results then return response.end results

      # Categories was not cached, so query and then save in cache
      Categories.getAll (error, results) ->
        json = JSON.stringify results, null, 2
        cache.set "route:api/categories", json
        response.end json


exports["@singleton"] = true
exports["@require"] = [
  "models/categories"
  "controllers/cache"
  "controllers/email"
]