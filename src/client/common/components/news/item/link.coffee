module.exports = (scope, element, attributes, ngModel) ->

  ngModel.$render = ->
    scope.story = story = ngModel.$modelValue or {}
    story.score = story.upvotes + story.downvotes + 1
