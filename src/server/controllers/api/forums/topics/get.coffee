exports = module.exports = (Topics) ->
  controller = (request, response, next) ->
    # Get all the Topics from the DB.
    Topics.query()

    .then (results) -> response.json results



exports["@singleton"] = true
exports["@require"] = [
  "models/forums/topics"
]
