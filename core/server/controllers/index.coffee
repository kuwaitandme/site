

# Controller for the landing page. Displays the front-page with the top
# classifieds.
Controller = module.exports = (Cache, Items) ->
  # Description for the meta tag
  description = "Publish and Browse classifieds in Kuwait. Quick, easy and
    absolutely free! Jobs, property, real estate, cars and classifieds in Kuwait.
    Post an ad, browse ads, buy, sell or rent."

  (request, response, next) ->
    Items.query().then (models) ->
      response.render "main/landing",
        description: description
        data: models

    .catch (e) -> next e



Controller["@require"] = [
  "libraries/cache"
  "models/sharing/items"
]
Controller["@routes"] = ["/"]
Controller["@singleton"] = true