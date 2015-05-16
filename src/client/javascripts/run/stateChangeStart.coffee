exports = module.exports = ($root, console, $storage) ->
  body = document.body
  @name = "[run:stateChangeStart]"
  console.log @name, "initialized"

  $root.bodyClasses ?= {}

  $root.$on "$stateChangeStart",
    (event, toState, toParams, fromState, fromParams) ->
      # $storage.tmp null, null
      $root.bodyStyles = {}

      $root.bodyClasses.loading = true

      console.log "[router] switching from '#{fromState.name}' to '#{toState.name}'"
      if toState.templateUrl?
        bodyid = toState.templateUrl.replace "/", "-"
        body.id = bodyid
      setTimeout (-> document.body.scrollTop = 0), 1

  $root.$on "page-loaded", ->
    setTimeout -> $root.$apply -> $root.bodyClasses.loading = false


exports.$inject = [
  "$rootScope"
  "$log"
  "$storage"
]