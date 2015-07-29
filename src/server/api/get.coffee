exports = module.exports = (settings, Locations, Categories, Classifieds, Users) ->
  controller = (request, response, next) ->
    data =
      version: "2.0.0"
      authors: [
        "Steven Enamakel" : {
          role: "founder"
          email: "founder@kuwaitandme.com"
        }
      ]
      description: "This is the API for communicating with all frontend apps"
      md5: settings.md5
      status: "online"
    response.json data


exports["@require"] = [
  "igloo/settings"

  "models/locations"
  "models/categories"
  "models/classifieds"
  "models/users"
]
