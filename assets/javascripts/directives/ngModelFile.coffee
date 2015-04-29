module.exports = ->
  link = (scope, element, attributes) ->
    element.bind 'change', (changeEvent) ->
      reader = new FileReader
      files = changeEvent.target.files
      results = []

      readFile = (index) ->
        if index >= files.length then return finish()
        file = files[index]

        reader.onload = (event) ->
          results.push event.target.result
          readFile index + 1

        reader.readAsDataURL file


      finish = -> (scope.ngModelFile or ->)() results

      # Start recursively reading the files
      readFile 0

  scope: ngModelFile: "&"
  link: ['scope', 'element', 'attributes', link]