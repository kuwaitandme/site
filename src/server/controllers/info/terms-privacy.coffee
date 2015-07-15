# Controller for the privacy page. Simply displays the privacy policy view.
exports = module.exports = (renderer) ->
  controller = (request, response, next) ->
    args =
      page: "info/terms-privacy"
      title: response.__ "title.terms-privacy"

    renderer request, response, args, true


exports["@require"] = ["libraries/renderer"]
exports["@singleton"] = true