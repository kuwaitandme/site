module.exports = Backbone.View.extend
  name: "[view:classified-single]"
  template: template['classified/single']
  templateOptions:
    isGuest: false

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
    @singleTemplate    = template['components/single']

    @$messages          = @$ "#single-messages"
    @$promptModal       = @$ "#promptModal"
    @$admin             = @$ '#admin-single'
    @$content           = @$ '#classified-container'

    @model = new @resources.Models.classified
    @listenTo @model, 'sync', @modelChange

    _.bindAll this, 'rearrangeGallery'


  continue: ->
    id = @resources.historyState.parameters
    savedClassified = window.data.classified
    if savedClassified and savedClassified._id is id and false
      @model.set window.data.classified
      @model.trigger 'parse'
      @populateDOM()
    else
      @model.id = id
      @listenToOnce @model, 'sync', @populateDOM
      @model.fetch()

    urlHelpers = @resources.Helpers.url
    @$el.fadeIn()
    @modelChange()

    authHash = urlHelpers.getParam 'authHash'
    @model.set 'authHash', authHash

    ($ document).foundation 'clearing', 'reflow'
    @renderAdminbar()

    ($ window).on 'resize', @rearrangeGallery

  pause: -> ($ window).off 'resize', @rearrangeGallery

  rearrangeGallery: -> @$gallery.masonry()

  populateDOM: ->
    @model.parseVariables()
    @title = -> @model.get 'title'
    @setTitle()

    # Add the main template
    @$content.html @singleTemplate @model.toJSON()
    @resources.language.translate @$content

    @$gallery = @$ '.c-gallery'
    @$gallery.masonry itemSelector: 'li'
    @$gallery.masonry()

    # Add the image templates
    images = @model.get 'images'
    # @$gallery.hide()n
    if images and images.length > 0 then @loadImages()

    @$gmap = @$ '#map-canvas'
    @$gmap.css 'max-height', ($ window).height()/2
    @$gmap.hide()

    # Render google maps
    if not @gmap?
      GoogleMaps = new @resources.external.GoogleMaps
      GoogleMaps.onLoad => @initializeGoogleMaps()


  actionHandle: (event) ->
    $el = $ event.currentTarget
    action = $el.data 'action'

    finish = =>
      if @model.hasChanged()
        @model.save @model.changedAttributes(), patch: true

    switch action
      when 'publish'
        @model.set 'status', @model.status.ACTIVE
        @model.save()
        finish()

      when 'archive'
        @model.set 'status', @model.status.ARCHIVED
        @model.save()
        finish()

      when 'repost'
        if @model.get 'guest' then @model.set status: @model.status.INACTIVE
        else @model.set status: @model.status.ACTIVE
        @model.save()
        finish()

      when 'ban'
        @showPromptModal 'banning', (reason) =>
          @model.set
            status: @model.status.BANNED
            moderatorReason: reason
          @model.save()
          finish()

      when 'reject'
        @showPromptModal 'rejecting', (reason) =>
          @model.set
            status: @model.status.REJECTED
            moderatorReason: reason
          @model.save()
          finish()

      when 'report'
        @showPromptModal 'reporting', (reason) =>
          reports = _.clone @model.get 'reports'
          reports.push reason
          @model.unset "reports", silent: true
          @model.set reports: reports
          @model.save()
          finish()

      when 'edit'
        if @templateOptions.isGuest
          url = "guest/#{@model.id}/edit?authHash=#{@model.get 'authHash'}"
        else
          url = "classified/#{@model.id}/edit"
        @resources.router.redirect "#{@resources.language.urlSlug}/#{url}"


  showPromptModal: (actionText, callback) ->
    @$promptModal.foundation 'reveal', 'open'
    (@$promptModal.find 'h3 span').html actionText
    $submitButton = @$promptModal.find '.submit'
    $textarea = @$promptModal.find 'textarea'

    $submitButton.one 'click', (event) =>
      @$promptModal.foundation 'reveal', 'close'
      callback $textarea.val()


  modelChange: ->
    urlHelpers = @resources.Helpers.url
    authHash = urlHelpers.getParam 'authHash'
    @model.set 'authHash', authHash

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
      # set timeout to prevent weird offset effect
      setTimeout (-> init meta.gmapX, meta.gmapY), 250
      @$gmap.show()

  loadImages: ->
    imageLoader = @resources.Library.imageLoader

    $imgs = @$ '[data-src]'
    total = $imgs.length

    @$gallery.magnificPopup type: 'image', delegate: 'a', gallery: enabled: true

    $imgs.each (i) =>
      $img = $imgs.eq i
      $container = $img.parent().parent()
      src = $img.data 'src'

      $container.addClass 'image-loading'
      createSuccessHandler = (elem) => =>
        @$gallery.masonry()
        elem.removeClass 'image-loading'
        .addClass 'image-success'
        @$gallery.masonry()
        if --total is 0 then ($ document).foundation 'clearing', 'reflow'

      createFailureHandler = (elem) => =>
        elem.removeClass 'image-loading'
        .addClass 'image-failed'
        @$gallery.masonry()
        if --total is 0 then ($ document).foundation 'clearing', 'reflow'

      $img.attr 'src', src
      console.log @$gallery
      @$gallery.masonry 'layout'

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
    urlHelpers = @resources.Helpers.url
    superEditable = false
    editable = false

    # Get the template for the admin bar
    adminTemplate = template['components/admin-single']

    # Get the currently loggedin user
    user = @resources.currentUser

    # If this is a guest classified, check the authHash
    if (@model.get 'guest') and
    (urlHelpers.getParam 'authHash') and
    (location.pathname.split '/')[2] is 'guest' then editable = true

    # Check if the user is the owner or the moderator
    if user.id == @model.get 'owner' then editable = true
    if user.get 'isModerator' then superEditable = true

    # Add the admin template
    if editable or superEditable
      @$admin.show().html adminTemplate
        _id: @model.id
        editable: editable
        superEditable: superEditable

      @resources.language.translate @$admin
    else @$admin.hide()