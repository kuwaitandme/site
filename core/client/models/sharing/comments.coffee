Model = ($http, $log, Environment) ->
  logger = $log.init Model.tag
  logger.log "initializing"

  new class
    upvote: (id) ->
      $http
        method: "PUT"
        url: "#{Environment.url}/api/sharing/comments/#{id}/upvote"

    createChildComment: (id, data, headers={}) ->
      $http
        data: data
        headers: headers
        method: "POST"
        url: "#{Environment.url}/api/sharing/comments/#{id}/children"


Model.tag = "model:sharing/comments"
Model.$inject = [
  "$http"
  "$log"
  "@environment"
  "@storage"
]
module.exports = Model