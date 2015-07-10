name = "[run:stateChangeStart]"


exports = module.exports = ($root, $log, $storage, $timeout) ->
  body = document.body
  $log.log name, "initialized"

  $root.bodyClasses ?= {}

  $root.$on "$stateChangeStart",
    (event, toState, toParams, fromState, fromParams) ->
      $log.log name, "switching #{fromState.name} -> #{toState.name}"

      # Set the loading class on the page
      $root.bodyClasses.loading = true

      # Give a proper id to <body>
      if toState.controller?
        body.id = toState.controller.replace /\//g, "-"


exports.$inject = [
  "$rootScope"
  "$log"
  "$storage"
  "$timeout"
]
