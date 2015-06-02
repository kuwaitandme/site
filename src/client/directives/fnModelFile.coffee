module.exports = ->
  scope: fnModelFile: "&"

  link: (scope, element, attributes) ->
    element.bind "change", (changeEvent) ->
      reader = new FileReader
      files = changeEvent.target.files
      results = []

      (scope.fnModelFile or ->)() files
