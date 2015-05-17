exports = module.exports = ($root, console, $ga) ->
  body = document.body
  @name = "[run:pageLoad]"
  console.log @name, "initialized"

  $root.bodyClasses ?= {}
  $root.$on "page-loaded", ->
    setTimeout -> $root.$apply -> $root.bodyClasses.loading = false
    $ga.sendPageView()


exports.$inject = [
  "$rootScope"
  "$log"
  "$google.analytics"
]