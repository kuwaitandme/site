module.exports = ->
  scope:
    ngModelFile: '='
    ngModelFileFinish: "&"

  link: (scope, element, attributes) ->
    element.bind 'change', (changeEvent) ->
      reader = new FileReader

      reader.onload = (loadEvent) ->
        scope.$apply -> scope.ngModelFile = loadEvent.target.result
        console.log scope.ngModelFileFinish()
        (scope.ngModelFileFinish or ->)()

      reader.readAsDataURL changeEvent.target.files[0]