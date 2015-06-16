# Controller for the privacy page. Simply displays the privacy policy view.
controller = module.exports =
  get: (request, response, next) ->
    if not request.isAuthenticated()
      return response.redirect "/?error=need_login"

    args =
      page: "account/credits"
      title: response.__ "title.account.credits"

    render = global.modules.renderer
    render request, response, args, true
