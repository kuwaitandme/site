module.exports = Backbone.View.extend
  name: '[view:classified-post:images]'
  template: template['classified/post/images']

  events: 'click .dz-preview .delete div': 'removeFile'

  start: (options) ->
    @$filePreview = @$ '#image-upload-preview'
    @filesToDelete = []

    @initDropzone()
    @setDOM()


  # Handler function to remove the file from the Uploads queue
  removeFile: (event) ->
    # Find the index of the file
    $el = $(event.currentTarget)
    $li = $el.parent().parent()
    src = ($li.find 'img').attr 'alt'
    index = $li.index()

    if $li.data 'uploaded'
      # Set this in our queue of files that have to removed from the server
      @filesToDelete.push src
    else
      # Remove it from the file Queue
      for file in @dropzone.files
        if file.name is src then file.status = 'delete'


    # Remove the thumbnail from the DOM
    $li.remove()


  # Initializes the drop-zone
  initDropzone: ->
    Dropzone.autoDiscover = false

    # Create the dropzone
    $el = ((@$ '#image-upload').eq 0).dropzone url: '/'
    @dropzone = $el[0].dropzone
    @dropzone.previewsContainer = @$filePreview[0]

    # Setup each of the custom options for the drop-zone
    options = @dropzone.options
    options.autoProcessQueue = false
    options.paramName = 'files'
    options.uploadMultiple = true
    options.previewTemplate = '
      <li class="dz-preview">\
        <img data-dz-thumbnail />\
        <div class="font-awesome delete">\
          <div>&#xf00d;</div>\
        </div>
      </li>'


  addImage: (img) ->
    html = "<li class='dz-preview dz-image-preview' data-uploaded='true'>
      <img data-dz-thumbnail='' alt='#{img}' height='100' src='/uploads/thumb/#{img}'>
      <div class='font-awesome delete'><div>&#xf00d;</div></div>
    </li>"
    @$filePreview.append html


  setModel: ->
    # Start grabbing the files from the drop-zone
    files = @dropzone.getQueuedFiles()

    # Append each file into the model
    @model.attributes.files = []
    for file in files
      @model.attributes.files.push file

    @model.set 'filesToDelete', @filesToDelete


  setDOM: ->
    images = @model.get 'images'
    for image in images then @addImage image