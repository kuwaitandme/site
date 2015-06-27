exports = module.exports = ($root, $log, $storage, $timeout) ->
  body = document.body
  @name = "[run:stateChangeStart]"
  $log.log @name, "initialized"

  $root.bodyClasses ?= {}

  $root.$on "$stateChangeStart",
    (event, toState, toParams, fromState, fromParams) ->
      # $storage.tmp null, null
      $root.bodyStyles ?= {}
      $root.bodyClasses.loading = true

      $log.log "[router] switching #{fromState.name} -> #{toState.name}"

      # Give a proper id to <body>
      if toState.controller?
        body.id = toState.controller.replace /\//g, "-"

      # Reset the scroll position.
      $timeout(100).then -> body.scrollTop = 0


exports.$inject = [
  "$rootScope"
  "$log"
  "$storage"
  "$timeout"
]
