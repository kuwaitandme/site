exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    options =
      page: "account/classifieds"
      title: response.__ "title.account.classifieds"
    renderer request, response, options, true


exports["@singleton"] = true