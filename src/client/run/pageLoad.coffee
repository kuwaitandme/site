exports = module.exports = ($log, $root, ga) ->
  body = document.body
  name = "[run:pageLoad]"
  $log.log name, "initialized"

  $root.$on "page-loaded", (event, value={}) ->
    # Remove the loading class, so that loading bar gets hidden away.
    $root.bodyClasses.loading = false

    # Set the header's backbutton accordingly..
    $root.bodyClasses["show-header-backbutton"] = value.allowBackNavigation

    # Send a pageview in google analytics
    ga.sendPageView()


exports.$inject = [
  "$log"
  "$rootScope"

  "Google.Analytics"
]
