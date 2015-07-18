module.exports = pagination = (bookshelf) ->
  # Extend updates the first object passed to it, no need for an assignment
  bookshelf.Model = bookshelf.Model.extend
  ###
    ## The main schema
    This object represents the schema of the model. You should override this
    with your own schema. Keywords and properties are set following
    [jsonschema's rules](https://www.npmjs.com/package/jsonschema#complex-example-with-split-schemas-and-references)
  ###
  schema:
    id: "/main"
    type: "object"


