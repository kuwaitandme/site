Controller = module.exports = (renderer) ->
  (request, response, next) ->
    options =
      page: "account/classifieds"
      title: response.__ "title.account.classifieds"
    renderer request, response, options, true


Controller["@singleton"] = true