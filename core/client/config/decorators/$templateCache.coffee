# http://stackoverflow.com/questions/22080981/loading-ng-include-partials-from-local-pre-loaded-jst-template-cache
exports = module.exports = ($provide) ->
  decorator = ($templateCache, $sniffer, $window) ->
    originalGet = $templateCache.get

    $templateCache.get = (key) ->
      value = originalGet key
      if not value
        # JST is where my partials and other templates are stored
        # If not already found in the cache, look there...
        if JST[key]? then value = JST[key] $window.publicData
        if value then $templateCache.put key, value
      value
    $templateCache
  this

  decorator.$inject = [
    "$delegate"
    "$sniffer"
    "$window"
  ]
  $provide.decorator "$templateCache", decorator


exports.$inject = ["$provide"]