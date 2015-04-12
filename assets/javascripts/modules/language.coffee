# EXPLAIN CONTROLLER HERE
# convert into backbone model
module.exports = class controller
  name: '[language]'
  fallback: false


  constructor: ->
    @resources = App.Resources
    console.log @name, 'initializing'

    _.extend this, Backbone.Events

    str = location.pathname
    lang = location.pathname.match /^\/(..)/
    if lang? then @currentLanguage =  lang[1]
    else @currentLanguage =  "en"

    @urlSlug = "/#{@currentLanguage}"

    console.log @name, "using language", @currentLanguage


  fetch: (callback=->) ->
    cache = @resources.cache.get "app:language:#{@currentLanguage}"

    if cache?
      console.log @name, "language found in cache"
      @currentDictonary = JSON.parse cache
      @trigger 'synced'
    else
      console.log @name, "language not found in cache"
      @downloadLanguage @currentLanguage, (error, response) =>
        console.log @name, response

        @currentDictonary = response
        json = JSON.stringify response
        @resources.cache.set "app:language:#{@currentLanguage}", json
        @trigger 'synced'


  downloadLanguage: (lang, callback) ->
    console.log @name, "downloading language from server"
    ajax = @resources.Helpers.ajax
    $.ajax
      beforeSend: ajax.setHeaders
      dataType: 'json'
      type: "GET"
      url: "/api/lang/#{lang}"
      success: (response) -> callback null, response
      error:   (response) -> callback response


  setLanguage: (lang, callback=->) ->
    console.log @name, "switching language to", lang
    @currentLanguage = lang
    @fetch callback

  translate: ($el) ->
    if not $el.data 'translated' then $el.data 'translated', true
    else return
    console.log @name, 'translating element'

    getLanguageItem = (key) => (@get key) or key

    $els = $el.find '[lang-placeholder]'
    $els.each (i) ->
      $el = $els.eq i
      $el.attr 'placeholder', getLanguageItem $el.attr 'lang-placeholder'

    $els = $el.find '[lang-value]'
    $els.each (i) ->
      $el = $els.eq i
      $el.val getLanguageItem $el.attr 'lang-value'

    $els = $el.find '[lang-html]'
    $els.each (i) ->
      $el = $els.eq i
      $el.html getLanguageItem $el.attr 'lang-html'

  # Function to get a key-string pair from the cache, given the key
  get: (key) -> @currentDictonary[key]