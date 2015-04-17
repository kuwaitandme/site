# EXPLAIN CONTROLLER HERE
# convert into backbone model
module.exports = class controller
  name: '[language]'
  fallback: false


  constructor: ->
    @resources = App.Resources
    console.log @name, 'initializing'

    _.extend this, Backbone.Events
    @$html = $ 'html'

    str = location.pathname
    lang = location.pathname.match /^\/(..)/
    if lang? and lang[1] in ['en', 'ar', 'dg'] then currentLanguage =  lang[1]
    else currentLanguage =  "en"

    @setLanguage currentLanguage

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
    @$html.attr 'lang', lang
    @urlSlug = "/#{@currentLanguage}"
    @fetch callback

  translate: ($container) ->
    console.log @name, 'translating element'

    getLanguageItem = (key) => (@get key) or key

    $els = $container.find '[lang-placeholder]'
    $els.each (i) ->
      $el = $els.eq i
      $el.attr 'placeholder', getLanguageItem $el.attr 'lang-placeholder'

    $els = $container.find '[lang-value]'
    $els.each (i) ->
      $el = $els.eq i
      $el.val getLanguageItem $el.attr 'lang-value'

    $els = $container.find '[lang-html]'
    $els.each (i) ->
      $el = $els.eq i
      $el.html getLanguageItem $el.attr 'lang-html'


  localizeNumber: (number) ->
    if @currentLanguage == 'ar'
      @resources.Helpers.numbers.toArabic number
    else number


  # Function to get a key-string pair from the cache, given the key
  get: (key) -> @currentDictonary[key]