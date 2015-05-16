# http://stackoverflow.com/questions/22080981/loading-ng-include-partials-from-local-pre-loaded-jst-template-cache
exports = module.exports = ($provide) ->
  decorator = ($delegate, $sniffer, $window) ->
    originalGet = $delegate.get

    $delegate.get = (key) ->
      value = originalGet key
      if not value
        # JST is where my partials and other templates are stored
        # If not already found in the cache, look there...
        if JST[key]? then value = JST[key] $window.publicData
        if value then $delegate.put key, value
      value
    $delegate
  this

  decorator.$inject = [
    "$delegate"
    "$sniffer"
    "$window"
  ]
  $provide.decorator "$templateCache", decorator


exports.$inject = ["$provide"]