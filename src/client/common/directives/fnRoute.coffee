###*
 * This directive is responsible for properly routing the app, when it using
 * HTML5's pushstate or fall-back hash URLs.
 *
 * This way, we can deploy the app into PhoneGap application (which use
 * hashbang URLs) without rewriting the links and have the entire app navigate
 * properly.
###
exports = module.exports = ($location) ->
  link: (scope, element, attributes) ->
    element = attributes.$$element[0]

    # Now observe the fnRoute attribute.
    attributes.$observe "fnRoute", (value) ->
      # If there are any changes, then generate and set the href value properly.
      if $location.$$html5 then element.href = value
      else element.href = "##{ value }"


exports.$inject = ["$location"]
