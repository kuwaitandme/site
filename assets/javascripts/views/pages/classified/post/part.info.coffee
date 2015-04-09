module.exports = Backbone.View.extend
  name: '[view:classified-post:info]'
  template: template['classified/post/info']

  start: (options) ->
    @$description = @$ '#description textarea'
    @$title       = @$ '#title input'
    @$errorTitle  = @$ '#title small.error'
    @$errorDesc   = @$ '#description small.error'

    @populateDOM()


  validate: ->
    ret = true
    $els = (@$ '.show-error').removeClass 'show-error'

    title = @$title.val()
    description = @$description.val()

    console.log title, description
    if not title
      @$title.parent().addClass 'show-error'
      @$errorTitle.html 'Please give a title (min 10 char)'
      ret = false
    else if title.trim().length < 10
      @$title.parent().addClass 'show-error'
      @$errorTitle.html 'Title is too short (min 10 char)'
      ret = false
    else if  title.trim().length > 120
      @$title.parent().addClass 'show-error'
      @$errorTitle.html 'Title is too long (max 120 char)'
      ret = false

    if not description
      @$description.parent().addClass 'show-error'
      @$errorDesc.html 'Please give a description (min 20 char)'
      ret = false
    else if description.trim().length < 20
      @$description.parent().addClass 'show-error'
      @$errorDesc.html 'Description is too short (min 20 char)'
      ret = false
    else if description.trim().length > 500
      @$description.parent().addClass 'show-error'
      @$errorDesc.html 'Description is too long (max 500 char)'
      ret = false

    if ret then @setModel()
    ret


  setModel: ->
    @model.set
      description: @$description.val()
      title:       @$title.val()


  populateDOM: ->
    @$description.val @model.get 'description'
    @$title.val       @model.get 'title'