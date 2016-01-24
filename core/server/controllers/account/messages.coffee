Controller = module.exports = (renderer) ->
  controller = (request, response, next) ->
    # if not request.isAuthenticated()
    #   return response.redirect "/?_error=need_login"

    options =
      page: "account/messages"
      title: response.__ "title.account.messages"
    renderer request, response, options, true


Controller["@singleton"] = true