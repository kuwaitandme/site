exports = module.exports = ($root, console) ->
  body = document.body
  @name = "[run:pageLoad]"
  console.log @name, "initialized"

  $root.bodyClasses ?= {}
  $root.$on "page-loaded", ->
    setTimeout -> $root.$apply -> $root.bodyClasses.loading = false


exports.$inject = [
  "$rootScope"
  "$log"
]