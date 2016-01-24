# An Angular service which helps with creating recursive directives.
Service = module.exports = ($compile, angular) ->
  ###
    Manually compiles the element, fixing the recursion loop.
  ###
  compile: (element, link) ->
    # Normalize the link parameter
    if angular.isFunction link then link = post: link

    # Break the recursion loop by removing the contents
    contents = element.contents().remove()
    compiledContents = undefined

    ret =
      pre: if link and link.pre then link.pre else null
      post: (scope, element) ->
        # Compile the contents
        if !compiledContents then compiledContents = $compile contents

        # Re-add the compiled contents to the element
        compiledContents scope, (clone) -> element.append clone

        # Call the post-linking function, if any
        if link and link.post then link.post.apply null, arguments
    return ret


Service.$inject = [
  "$compile"
  "angular"
]