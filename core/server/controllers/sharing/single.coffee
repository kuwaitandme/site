exports = module.exports = (Items) ->
  controller = (request, response, next) ->
    Item.getBySlug request.params[0]
    .then (results) ->
      # Start parsing out the Item's data
      item = results.toJSON()
      if not item.id? then return next()
      if item.meta? then noIndex = item.meta.robotsNoIndex

      # Render the page! NOTE that this controller will not have any cache
      # because of the nature of it's content.. And so is the most expensive
      # page in terms of response time.
      options =
      response.render "item/single",
        data:
          noIndex: noIndex or false
          item: item
        description: item.description
        title: item.title

    .catch next


exports["@require"] = ["models/sharing/items"]
exports["@singleton"] = true