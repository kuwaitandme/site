# Description for the meta tag
description = "Publish and Browse classifieds in Kuwait. Quick, easy and
  absolutely free! Jobs, property, real estate, cars and classifieds in Kuwait.
  Post an ad, browse ads, buy, sell or rent."


# Controller for the landing page. Displays the front-page with the top
# classifieds.
exports = module.exports = (Cache, Items) ->
  routes: ["/"]
  controller: (request, response, next) ->
    Items.query().then (models) ->
      response.render "main/landing",
        description: description
        data: models

    .catch (e) -> next e



exports["@require"] = [
  "libraries/cache"
  "models/sharing/items"
]
exports["@singleton"] = true