# Description for the meta tag
description = "Publish and Browse classifieds in Kuwait. Quick, easy and
  absolutely free! Jobs, property, real estate, cars and classifieds in Kuwait.
  Post an ad, browse ads, buy, sell or rent."

# Cache options
cache =
  timeout: 60 * 10 # Give a 10 minute lifespan
  key: "route:/"


# Controller for the landing page. Displays the front-page with the top
# classifieds.
exports = module.exports = (Cache, renderer, Classifieds) ->

  controller = (request, response, next) ->

    # First check the cache..
    Cache.get cache.key

    # If nothing in the cache was found, then the function throws an error. We
    # catch it here and re-fill the cache by calculating the counters again..
    .catch ->
      # Classifieds.query status: Classifieds.statuses.ACTIVE
      # .then (classifieds) ->
      #   json = classifieds.toJSON()
      #   Cache.set cache.key, json, cache.timeout
      #   json
      ""
    # Once we get classifieds (either from the cache or from the DB), we start
    # rendering the page
    .then (classifieds) ->
      options =
        cache: cache
        # data: classifieds: classifieds
        description: description
        page: "landing"
        title: response.__ "title.landing"

      renderer request, response, options

    .catch next


exports["@require"] = [
  "libraries/cache"
  "libraries/renderer"
  "models/classifieds"
]
exports["@singleton"] = true
