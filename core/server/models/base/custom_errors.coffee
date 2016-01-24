Plugin = module.exports = (NotFoundError) ->
  (bookshelf) ->
    # First we override the old extend method
    oldExtend = bookshelf.Model.extend
    bookshelf.Model.extend = ->
      # Extend the model and temporarily save it's results elsewhere
      ret = oldExtend.apply this, arguments

      # Return the extended model.
      ret.NotFoundError = NotFoundError

      # Return the extended model.
      ret

    # Return the customized bookshelf instance
    bookshelf