Plugin = module.exports = (bookshelf) ->
  # First we override the old extend method
  bookshelf.Model.oldExtend = bookshelf.Model.extend
  bookshelf.Model.extend = ->
    # Extend the model and temporarily save it's results elsewhere
    ret = bookshelf.Model.oldExtend.apply this, arguments

    # Now we process the enum fields!
    enums = arguments[0].enums or {}
    for e of enums then do (e) =>
      value = enums[e]

      # For each enum field, we intanstiate a Backbone.Model
      Model = bookshelf.Model.oldExtend(tableName: value.tableName)

      # Then we query all the row from it's table. This happens asyncronously
      # so we use assign the values back to the class by using the 'ret'
      # reference variable.
      Model.forge().query().then (json) =>
        # If a pick option was set, then start picking the proper attribute
        # and then save!
        if value.pick?
          picked = {}
          for item in json then picked[item[value.pick]] = item.id
          json = picked

        # Finally we attach it back as a static attribute to the model!
        ret[e] = json

    # Return the extended model.
    ret

  # Return the customized bookshelf instance
  bookshelf