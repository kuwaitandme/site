###
## **Language** module
This module is responsible for making the App multi-lingual. It downloads the
different language dictionaries and caches them into the localStorage. It can
also translate DOM elements based on these dictionaries.

The language module translates DOM elements by following a specific pattern. See
*translate()* for more info.
###
module.exports = class controller
  name: '[language]'
  fallback: false


  ###
  ## *constructor():*
  This function initializes the module by setting the current language and
  downloading any other languages if necessary.
  ###
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


  ###
  ## *fetch():*
  This function fetches the dictionary of the current language, either from the
  cache or from the server. The function emits a 'synced' event when the
  dictionary has been downloaded.
  ###
  fetch: ->
    cache = @resources.cache.get "app:language:#{@currentLanguage}"
    if cache?
      console.log @name, "language found in cache"
      @currentDictonary = JSON.parse cache
      @trigger 'synced'
    else
      console.log @name, "language not found in cache"
      @downloadLanguage @currentLanguage, (error, response) =>
        @currentDictonary = response
        json = JSON.stringify response
        @resources.cache.set "app:language:#{@currentLanguage}", json
        @trigger 'synced'


  ###
  ## *downloadLanguage(lang, callback):*
  This function makes a call to the server API to get the language dictionary
  specified in *lang*. The *callback* function gets called with the response
  from the server (which is the language dictionary).
  ###
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


  ###
  ## *setLanguage(lang, callback):*
  A handy function to properly set the language of the App. *lang* should be
  either of the language slugs. (en/ar/dg)
  ###
  setLanguage: (lang, callback=->) ->
    console.log @name, "switching language to", lang
    @currentLanguage = lang
    @$html.attr 'lang', lang
    @urlSlug = "/#{@currentLanguage}"
    @fetch callback



  ###
  ## *translate($container):*
  This function translate the given DOM element by looking at the *lang-*
  attributes in every element and finding the right language value for it.

  The *lang-val* attribute should contain the key for language dictionary which
  should be used for the element value.

  The *lang-html* attribute should contain the key for language dictionary which
  should be used for the element's html.

  The *lang-placeholder* attribute should contain the key for language
  dictionary which should be used for the element's placeholder.
  ###
  translate: ($container) ->
    console.log @name, 'translating element'
    _getLanguageItem = (key) => (@get key) or key

    $els = $container.find '[lang-placeholder]'
    $els.each (i) ->
      $el = $els.eq i
      $el.attr 'placeholder', _getLanguageItem $el.attr 'lang-placeholder'

    $els = $container.find '[lang-value]'
    $els.each (i) ->
      $el = $els.eq i
      $el.val _getLanguageItem $el.attr 'lang-value'

    $els = $container.find '[lang-html]'
    $els.each (i) ->
      $el = $els.eq i
      $el.html _getLanguageItem $el.attr 'lang-html'


  localizeNumber: (number) ->
    if @currentLanguage == 'ar' then @resources.Helpers.numbers.toArabic number
    else number


  ###
  ## *get(key):*
  Function to get a key-string pair from the current dictionary.
  ###
  get: (key) -> @currentDictonary[key]