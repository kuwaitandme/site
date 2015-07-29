exports = module.exports = (Categories) ->
  controller = (request, response, next) ->
    Categories.query().then (results) -> response.json results


exports["@require"] = ["models/forums/categories"]
exports["@singleton"] = true
