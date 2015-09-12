exports = module.exports = ($provide) ->
  decorator = ($http, $sniffer, $window) ->
    originalGet = $http.get

    $http.pageAsJSON = ->
      url = $window.location.toString()
      url = url.replace $window.location.hash, ""
      url += if url.indexOf("?") > 1 then "&json" else "?json"
      $http.get url

    $http


  decorator.$inject = [
    "$delegate"
    "$sniffer"
    "$window"
  ]
  $provide.decorator "$http", decorator


exports.$inject = ["$provide"]