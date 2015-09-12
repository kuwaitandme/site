exports = module.exports = (settings) ->
  routes: [""]

  controller: (request, response, next) ->
    data =
      version: "2.0.0"
      authors: [
        "Steven Enamakel"
      ]
      description: "This is the API for communicating with all frontend apps"
      md5: settings.md5
      status: "online"
    response.json data


exports["@require"] = ["igloo/settings"]