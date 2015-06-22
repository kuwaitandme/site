# Description for the meta tag
description = "Publish and Browse classifieds in Kuwait. Quick, easy and
  absolutely free! Jobs, property, real estate, cars and classifieds in Kuwait.
  Post an ad, browse ads, buy, sell or rent."


# Controller for the landing page. Displays the front-page with the top
# classifieds.
exports = module.exports = (Cache, renderer, Classifieds) ->

  controller = (request, response, next) ->

    # Give a 10 minute timeout for the life in the cache
    cacheTimeout = 60 * 10

    cacheKey = "route:/"
    Cache.get cacheKey

    # If nothing in the cache was found, then the function throws an error. We
    # catch it here and re-fill the cache by calculating the counters again..
    .catch ->
      console.log "caching"
      Classifieds.query status: Classifieds.statuses.ACTIVE
      .then (classifieds) ->
        json = classifieds.toJSON()
        Cache.set cacheKey, json, cacheTimeout
        json
    .then (classifieds) ->
      args =
        data: classifieds: classifieds
        description: description
        page: "landing"
        title: response.__ "title.landing"

      renderer request, response, args, cacheTimeout
    .catch next


exports["@require"] = [
  "controllers/cache"
  "controllers/renderer"
  "models/classifieds"
]
exports["@singleton"] = true
