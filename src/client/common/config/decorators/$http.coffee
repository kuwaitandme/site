exports = module.exports = ($provide) ->
  decorator = ($delegate, $sniffer, $window) ->
    originalGet = $delegate.get

    $delegate.pageAsJSON = ->
      url = $window.location.toString()
      url += if url.indexOf("?") > 1 then "&json" else "?json"
      $delegate.get url

    $delegate


  decorator.$inject = [
    "$delegate"
    "$sniffer"
    "$window"
  ]
  $provide.decorator "$http", decorator


exports.$inject = ["$provide"]
