# http://stackoverflow.com/questions/14430655/recursion-in-angular-directives
# An Angular service which helps with creating recursive directives.
module.exports = Service = ($compile) ->
  ###
  Manually compiles the element, fixing the recursion loop.

  @param element
  @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
  @returns An object containing the linking functions.
  ###
  compile: (element, link) ->
    console.log element, link
    # Normalize the link parameter
    if angular.isFunction link then link = post: link

    # Break the recursion loop by removing the contents
    contents = element.contents().remove()
    compiledContents = undefined

    return {
      pre: if link and link.pre then link.pre else null
      post: (scope, element) ->
        # Compile the contents
        if !compiledContents then compiledContents = $compile contents

        # Re-add the compiled contents to the element
        compiledContents scope, (clone) -> element.append clone

        # Call the post-linking function, if any
        if link and link.post then link.post.apply null, arguments
    }


Service.$inject = ["$compile"]