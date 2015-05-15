exports = module.exports = (Locations, Categories, Classifieds, Users) ->
  controller = (request, response, next) ->
    data =
      authors: [
        "Steven Enamakel" : {
          role: "founder"
          email: "founder@kuwaitandme.com"
        }
      ]
      description: "This is the API for communicating with all frontend apps"
      # magic: config.magic
      status: "online"
    response.json data


exports["@require"] = [
  "models/locations"
  "models/categories"
  "models/classifieds"
  "models/users"
]