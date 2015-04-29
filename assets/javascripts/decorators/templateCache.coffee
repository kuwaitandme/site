exports = module.exports = ($provide) ->
  decorator = ($delegate, $sniffer) ->
    originalGet = $delegate.get

    $delegate.get = (key) ->
      value = originalGet key
      if not value
        # JST is where my partials and other templates are stored
        # If not already found in the cache, look there...
        value = JST[key]()
        if value then $delegate.put key, value
      value
    $delegate
  this

  $provide.decorator '$templateCache', ['$delegate', '$sniffer', decorator]


exports.$inject = ['$provide']