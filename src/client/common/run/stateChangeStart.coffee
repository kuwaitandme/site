name = "[run:stateChangeStart]"
exports = module.exports = ($root, $log, $storage, $timeout) ->
  $log.log name, "initializing"

  $root.bodyClasses ?= {}
  stateClasses = null

  $root.$on "$stateChangeStart",
    (event, toState, toParams, fromState, fromParams) ->
      $log.log name, "switching #{fromState.name} -> #{toState.name}"
      if stateClasses then $root.bodyClasses[stateClasses] = false

      # Set the loading class on the page
      $root.bodyClasses.loading = true

      # Give a proper id & class to the <body> tag
      if (controller = toState.controller)?
        document.body.id = controller.replace /\//g, "-"
        stateClasses = controller.replace /\//g, " "
        $root.bodyClasses[stateClasses] = true


exports.$inject = [
  "$rootScope"
  "$log"
  "$storage"
  "$timeout"
]
