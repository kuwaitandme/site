module.exports = Backbone.View.extend
  name: '[view:classified-post:info]'
  template: template['classified/post/info']

  events:
    "keyup #title input" : "titleChange"
    "keyup #description textarea" : "descriptionChange"


  start: (options) ->
    @$description  = @$ '#description textarea'
    @$title        = @$ '#title input'
    @$website      = @$ '#website input'
    @$errorwebsite = @$ '#website small.error'
    @$errorTitle   = @$ '#title small.error'
    @$errorDesc    = @$ '#description small.error'


  continue: -> @populateDOM()


  titleChange: (event) -> @_validateTitle()
  descriptionChange: (event) -> @_validateDescription()


  _validateTitle: ->
    title = @$title.val() or ""
    @$title.parent().removeClass 'show-error'

    if title.trim().length < 10
      @$title.parent().addClass 'show-error'
      @$errorTitle.html 'Please give a title (min 10 char)'
      return false
    else if title.trim().length > 120
      @$title.parent().addClass 'show-error'
      @$errorTitle.html 'Title is too long (max 120 char)'
      return false
    true


  _validateDescription: ->
    @$description.parent().removeClass 'show-error'
    description = @$description.val() or ""

    if description.length < 20
      @$description.parent().addClass 'show-error'
      @$errorDesc.html 'Description is too short (min 20 char)'
      return false
    else if description.length > 5000
      @$description.parent().addClass 'show-error'
      @$errorDesc.html 'Description is too long (max 5,000 char)'
      return false
    true


  _validateWebsite: -> true



  validate: ->
    console.log @name, 'validating'
    isValid = @_validateDescription()
    isValid = @_validateTitle() and isValid

    console.debug @name, 'validation:', isValid
    isValid


  setModel: ->
    contact = (@model.get 'contact') or {}
    contact.website = @$website.val()

    @model.set
      description: @$description.val(),
      title: @$title.val(),
      contact: contact


  populateDOM: ->
    @$description.val @model.get 'description'
    @$title.val @model.get 'title'

    contact = (@model.get 'contact') or {}
    @$website.val contact.website