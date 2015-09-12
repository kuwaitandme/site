exports = module.exports = (Items) ->
  routes: ["/sharing"]
  controller = (request, response, next) ->
    Items.query().then (result) -> response.json result
    .catch next


exports.APIroute = "/sharing/items/([0-9]+)"
exports["@require"] = ["models/sharing/items"]
exports["@singleton"] = true