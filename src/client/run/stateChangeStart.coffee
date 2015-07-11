name = "[run:stateChangeStart]"
exports = module.exports = ($root, $log, $storage, $timeout) ->
  $log.log name, "initializing"

  $root.bodyClasses ?= {}
  $root.$on "$stateChangeStart",
    (event, toState, toParams, fromState, fromParams) ->
      $log.log name, "switching #{fromState.name} -> #{toState.name}"

      # Set the loading class on the page
      $root.bodyClasses.loading = true

      # Give a proper id to <body>
      controller = toState.controller
      if controller? then document.body.id = controller.replace /\//g, "-"


exports.$inject = [
  "$rootScope"
  "$log"
  "$storage"
  "$timeout"
]
