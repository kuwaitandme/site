exports = module.exports = (Items) ->
  routes: ["/sharing/items"]
  controller: (request, response, next) ->
    Items.query()
    .then (result) -> response.json result
    .catch next


exports["@require"] = ["models/sharing/items"]
exports["@singleton"] = true