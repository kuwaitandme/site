module.exports = ($window)->
  scope: ngScroll: "&"

  link: (scope, element, attributes) ->
    raw = element[0]

    (angular.element $window).bind "scroll", (event) ->
      if (raw.scrollTop + raw.offsetHeight) >= raw.scrollHeight
        scrollFn = scope.ngScroll()
        if typeof scrollFn is "function" then scrollFn event
        # scope.$apply attr.whenScrolled