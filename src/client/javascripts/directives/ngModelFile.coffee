module.exports = ->
  scope: ngModelFile: "&"

  link: (scope, element, attributes) ->
    element.bind "change", (changeEvent) ->
      reader = new FileReader
      files = changeEvent.target.files
      results = []

      (scope.ngModelFile or ->)() files