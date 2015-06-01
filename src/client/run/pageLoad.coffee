exports = module.exports = ($log, $root, ga) ->
  body = document.body
  @name = "[run:pageLoad]"
  $log.log @name, "initialized"

  $root.bodyClasses ?= {}
  $root.$on "page-loaded", ->
    # Remove the loading class, so that loading bar gets hidden away.
    setTimeout -> $root.$apply -> $root.bodyClasses.loading = false
    # Send a pageview in google analytics
    ga.sendPageView()


exports.$inject = [
  "$log"
  "$rootScope"

  "Google.analytics"
]
