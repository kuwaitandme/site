module.exports = (scope, element, attributes, ngModel) ->

  ngModel.$render = ->
    scope.comment = comment = ngModel.$modelValue or {}
    comment.score = comment.upvotes + comment.downvotes + 1
