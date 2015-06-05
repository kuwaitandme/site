exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    if not request.isAuthenticated()
      return response.redirect "/auth?_error=need_login"

    # Redirect non-admin users to the auth page
    if (request.user.get "role") not in
    [Users.roles.MODERATOR, Users.roles.ADMIN]
      return response.redirect "/auth?_error=not_priv"

    options =
      page: "account/manage"
      title: response.__ "title.account.manage"
    renderer request, response, options, true


exports["@require"] = ["controllers/renderer"]
exports["@singleton"] = true
