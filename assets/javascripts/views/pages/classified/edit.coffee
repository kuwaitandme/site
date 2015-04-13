module.exports = (require './post').extend
  name: '[view:classified-edit]'
  templateOptions:
    isGuest: false
    hasClassified: true

  getModel: (callback) ->
    id = @resources.historyState.parameters
    urlHelper = @resources.Helpers.url

    if not @model? then @model = new @resources.Models.classified _id: id

    authHash = urlHelper.getParam 'authHash'
    @model.set 'authHash', authHash

    @model.fetch success: callback


  onAJAXfinish: (error, classified={}) ->
    if error
      @$spinner.hide()
      @views["#page-submit"].trigger 'continue'
      return @displayError error

    if not classified.guest then url = "classified/#{classified._id}"
    else url = "guest/#{classified._id}?authHash=#{classified.authHash}"

    @resources.router.redirect "#{@resources.language.urlSlug}/#{url}"