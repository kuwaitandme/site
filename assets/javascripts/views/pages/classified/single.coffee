url    = (require 'app-helpers').url

module.exports = Backbone.View.extend
  name: "[view:classified-single]"
  template: template['classified/single']
  messages:
    archived:  'This classified has been deleted'
    banned:    'This classified has been banned by a moderator'
    needlogin: 'You need to be logged in to make such requests'
    notfound:  'Classified was not found'
    rejected:  'This classified has been rejected by a moderator'
    reported:  'Your report has been successfully submitted'
    unpriv:    'You are not allowed to make such bogus requests'


  events:
    "submit form" : "submitHandle"
    "click .action" : "actionHandle"

  start: (@options = {}) ->
    console.debug @name, 'initializing', @options

    @slideshowTemplate = template['components/slideshow']
    @singleTemplate    = template['components/single']

    @$gmap              = @$ '#map-canvas'
    @$messages          = @$ "#single-messages"
    @$promptModal       = @$ "#promptModal"

    if @options.model
      @model = @options.model

      @populateDOM()
    else
      href = document.URL
      id = (href.substr (href.lastIndexOf '/') + 1)
      @model = new @resources.Models.classified
      @listenTo @model, 'sync', @modelChange

      savedClassified = window.data.classified

      if savedClassified and savedClassified._id is id
        @model.set window.data.classified
        @model.trigger  'parse'
        @populateDOM()
      else
        self = @
        @model.id = id
        @listenToOnce @model, 'sync', @populateDOM
        @model.fetch()


  continue: ->
    console.log @name, 'continue'
    @$el.fadeIn()
    @modelChange()
    ($ document).foundation 'clearing', 'reflow'
    @renderAdminbar()


  populateDOM: ->
    @model.parseVariables()
    @title = -> @model.get 'title'
    @setTitle()

    # Add the main template
    ($ '.c-content').html @singleTemplate @model.toJSON()

    # Add the image templates
    images = @model.get 'images'
    (@$ '.c-gallery').hide()
    if images and images.length > 0
      (@$ '.c-gallery').show().html @slideshowTemplate images: images
      @loadImages()
      $(document).foundation 'orbit', 'reflow'

    # (@$ '.page').css 'min-height', ($ window).height()

    @$gmap = @$ '#map-canvas'
    @$gmap.hide()

    # Render google maps
    init = => @initializeGoogleMaps()
    if not window.gmapInitialized
      window.gmapInitializeListeners.push init
    else init()


  actionHandle: (event) ->
    $el = $ event.currentTarget
    action = $el.data 'action'
    console.log action

    finish = =>
      if @model.hasChanged()
        @model.save @model.changedAttributes(), patch: true

    switch action
      when 'publish'
        @model.set 'status', @model.status.ACTIVE
        finish()

      when 'archive'
        @model.set 'status', @model.status.ARCHIVED
        finish()

      when 'repost'
        if @model.get 'guest' then @model.set status: @model.status.INACTIVE
        else @model.set status: @model.status.ACTIVE
        finish()

      when 'ban'
        @showPromptModal 'banning', (reason) =>
          @model.set
            status: @model.status.BANNED
            moderatorReason: reason
          finish()

      when 'reject'
        @showPromptModal 'rejecting', (reason) =>
          @model.set
            status: @model.status.REJECTED
            moderatorReason: reason
          finish()

      when 'report'
        @showPromptModal 'reporting', (reason) =>
          reports = _.clone @model.get 'reports'
          reports.push reason
          @model.unset "reports", silent: true
          @model.set reports: reports
          finish()


  showPromptModal: (actionText, callback) ->
    @$promptModal.foundation 'reveal', 'open'
    (@$promptModal.find 'h3 span').html actionText
    $submitButton = @$promptModal.find '.submit'
    $textarea = @$promptModal.find 'textarea'

    $submitButton.one 'click', (event) =>
      @$promptModal.foundation 'reveal', 'close'
      callback $textarea.val()


  modelChange: ->
    @$messages.html ""
    # window.location.hash = ""
    @renderAdminbar()

    # Display a message based on the classified's status.
    moderatorReason = @model.get 'moderatorReason'
    status = @model.get 'status'
    statuses = @model.status
    switch status
      when statuses.INACTIVE
        if @model.get 'guest'
          @addMessage 'This classified was posted anonymously and is yet to be reviewed', 'warning'
        else
          @addMessage 'This classified is to be reviewed', 'warning'

      when statuses.REJECTED
        @addMessage @messages.rejected
        @addMessage moderatorReason

      when statuses.ARCHIVED
        @addMessage @messages.archived

      when statuses.BANNED
        @addMessage @messages.banned
        @addMessage moderatorReason

      when statuses.FLAGGED
        @addMessage 'This classified has been reported too many times and is under review'


  # Adds a message of a given type. Type can be 'success', 'error' or 'warning'
  addMessage: (message, type='error') ->
    $el = $ "<li> #{message} </li>"
    $el.hide()
    $el.addClass type
    @$messages.append $el
    $el.fadeIn()


  submitHandle: (event) ->
    console.log @name, 'reading submit event'

    event.preventDefault()
    $form = $ event.currentTarget
    action = ($form.find "[name='action']").val()
    reason = ($form.find "[name='reason']").val()

    switch action
      when 'publish' then @model.set 'status', @model.status.ACTIVE
      when 'archive' then @model.set 'status', @model.status.ARCHIVED
      when 'repost'
        if @model.get 'guest'
          @model.set status: @model.status.INACTIVE
        else @model.set status: @model.status.ACTIVE
      when 'ban'
        @model.set
          status: @model.status.BANNED
          moderatorReason: reason
      when 'reject'
        @model.set
          status: @model.status.REJECTED
          moderatorReason: reason
      when 'report'
        reports = _.clone @model.get 'reports'
        reports.push reason
        @model.unset "reports", silent: true
        @model.set reports: reports

    if @model.hasChanged()
      @model.save @model.changedAttributes(), {patch: true}


  # Initializes Google maps if required.
  initializeGoogleMaps: ->
    # Initializes the map with the latitude and longitude given
    init = (lat, lng) =>
      myLatlng = new google.maps.LatLng lat, lng
      mapOptions =
        center: myLatlng
        mapTypeControl: false
        mapTypeId: google.maps.MapTypeId.ROADMAP
        scrollwheel: false
        zoom: 13

      # Add the map
      @gmap = new google.maps.Map @$gmap[0], mapOptions

      # Add the marker
      @gmarker = new google.maps.Marker
        position: myLatlng
        map: @gmap

    # If there are google co-ordinates saved, load up google maps
    meta = @model.get 'meta'
    if meta and meta.gmapX and meta.gmapY
      init meta.gmapX, meta.gmapY
      @$gmap.show()

  loadImages: ->
    imageLoader = @resources.Library.imageLoader

    $imgs = @$ '[data-src]'
    $imgs.each (i) =>
      $img = $imgs.eq i
      $container = $img.parent().parent()
      src = $img.data 'src'

      $container.addClass 'image-loading'
      createSuccessHandler = (elem) => =>
        elem.removeClass 'image-loading'
        .addClass 'image-success'
      createFailureHandler = (elem) => =>
        elem.removeClass 'image-loading'
        .addClass 'image-failed'

      $img.attr 'src', src
      # Append element into DOM and reload Masonry
      # @$classifiedList.append elem
      # @$classifiedList.masonry 'appended', elem

      # Use our special function to load the images. This function ensures
      # that the images are loaded smoothly, the containers are setup
      # properly and add the right CSS classes are set for the any effects
      imageLoader src,
        # This function is called when a image successfully loads. It makes
        # sure that the *image-loading* class is removed from the parent li
        # and the masonry layout is reset
        success: createSuccessHandler $container
        # This function is called when a image successfully loads. It makes
        # sure that the *image-loading* class is removed from the parent li
        # and the *image-failed* class is set. The masonry layout is reset
        failure: createFailureHandler $container
        target: $img


  renderAdminbar: ->
    superEditable = false
    editable = false

    # Get the template for the admin bar
    adminTemplate = template['components/admin-single']

    # Get the currently loggedin user
    user = @resources.currentUser

    # If this is a guest classified, check the authHash
    if (@model.get 'guest') and
    (url.getParam 'authHash') and
    (location.pathname.split '/')[1] is 'guest' then editable = true

    # Check if the user is the owner or the moderator
    if user.id is @model.get 'owner' then editable = true
    if user.get 'isModerator' then superEditable = true

    # Add the admin template
    if editable or superEditable
      (@$ '#admin-single').html adminTemplate
        _id: @model.id
        editable: editable
        superEditable: superEditable
    else (@$ '#admin-single').hide()