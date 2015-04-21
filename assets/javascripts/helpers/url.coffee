module.exports =

  # Serialize the object into a format recognized by HTTP "GET"
  serializeGET: (obj) ->
    str = []
    for p of obj then if obj.hasOwnProperty p
      str.push "#{encodeURIComponent p}=#{encodeURIComponent obj[p]}"
    str.join '&'


  # Get the path of the URL without any GET parameters
  getPlainPath: ->
    url = document.URL
    # Get rid of any GET parameters
    if (url.indexOf '?') > -1 then url = url.substr 0, url.indexOf '?'
    if (url.indexOf '#') > -1 then url = url.substr 0, url.indexOf '#'
    url

  # Returns the get string of the given url.
  getGETstring: (url) ->
    if not url then url = document.URL
    if (url.indexOf '?') > -1
      return url.substr (url.indexOf '?'), url.length
    ''

  # Returns the value of the given GET parameter in the current URL
  getParam: (name) ->
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
    url = window.location.search
    regex = new RegExp "[\\?&]#{name}=([^&#]*)"
    results = regex.exec url
    if results == null then '' else decodeURIComponent results[1].replace /\+/g, ' '


  # Re-construct the page's url with the new GET parameters (passed as an
  # object array)
  reconstruct: (get_data) -> "#{@getPlainPath()}?#{@serializeGET get_data}"


  # Inserts the given parameter properly into the URL.
  #
  # @param  {[type]} paramName   [description]
  # @param  {[type]} paramValue [description]
  insertParam: (paramName, paramValue) ->
    url = window.location.href
    if (url.indexOf "#{paramName}=") >= 0
      prefix = url.substring 0, url.indexOf paramName
      suffix = url.substring url.indexOf paramName
      suffix = (suffix.substring suffix.indexOf '=') + 1
      suffix = if (suffix.indexOf '&') >= 0 then suffix.substring suffix.indexOf '&' else ''
      url = prefix + paramName + '=' + paramValue + suffix
    else
      if (url.indexOf '?') < 0 then url += "?#{paramName}=#{paramValue}"
      else url += "&#{paramName}=#{paramValue}"
    url


  # Returns a url with the language code embedded into it
  href: (url) -> "/#{window.lang}/#{url}"