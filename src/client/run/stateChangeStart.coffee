exports = module.exports = ($root, $log, $storage) ->
  body = document.body
  @name = "[run:stateChangeStart]"
  $log.log @name, "initialized"

  $root.bodyClasses ?= {}

  $root.$on "$stateChangeStart",
    (event, toState, toParams, fromState, fromParams) ->
      # $storage.tmp null, null
      $root.bodyStyles = {}
      $root.bodyClasses.loading = true

      $log.log "[router] switching #{fromState.name} -> #{toState.name}"
      if toState.templateUrl?
        body.id = toState.controller.replace /\//g, "-"
      setTimeout (-> document.body.scrollTop = 0), 1


exports.$inject = [
  "$rootScope"
  "$log"
  "$storage"

  "Google.analytics"
]
