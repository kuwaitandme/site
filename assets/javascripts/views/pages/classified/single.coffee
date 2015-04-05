url    = (require 'app-helpers').url
view   = require '../../mainView'

module.exports = view.extend
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


  events: "submit form" : "submitHandle"

  start: (@options = {}) ->
    console.debug @name, 'initializing', @options

    @slideshowTemplate = template['components/slideshow']
    @singleTemplate    = template['components/single']

    @$gmap      = @$ '#map-canvas'
    @$messages  = @$ "#single-messages"
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
    @title = -> @model.get 'title'
    @setTitle()

    # Add the main template
    modelJSON = @model.toJSON()
    modelJSON.category = @resources.categories.findWhere _id: modelJSON.category
    ($ '.c-content').html @singleTemplate modelJSON

    # Add the image templates
    images = @model.get 'images'
    (@$ '.c-gallery').hide()
    if images and images.length > 0
      (@$ '.c-gallery').show().html @slideshowTemplate images: images

    # (@$ '.page').css 'min-height', ($ window).height()

    @$gmap = @$ '#map-canvas'
    @$gmap.hide()

    # Render google maps
    init = => @initializeGoogleMaps()
    if not window.gmapInitialized
      window.gmapInitializeListeners.push init
    else init()



  modelChange: ->
    @$messages.html ""
    # window.location.hash = ""

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