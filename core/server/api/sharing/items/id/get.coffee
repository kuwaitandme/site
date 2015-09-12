exports = module.exports = (Items) ->
  routes: ["/sharing/items/([0-9]+)"]
  controller: (request, response, next) ->
    Items.get(request.params[0]).then (result) -> response.json result
    .catch (e) -> next e


exports["@require"] = ["models/sharing/items"]
exports["@singleton"] = true