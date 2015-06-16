exports = module.exports = ($state, $root, $window, $log, $notifications) ->
  $root.$on "$viewContentLoaded", ->
    $notifications.parseURL()
    state = $state.$current
    if not state.scrollTo? $window.scrollTo 0, 0
    else
      return

      to = 0
      if (state.scrollTo.id != undefined)
        to = $(state.scrollTo.id).offset().top;
      if ($($window).scrollTop() == to)
        return
      # if (state.scrollTo.animated)
      #   $(document.body).animate scrollTop:to
      # else
      #   $window.scrollTo 0, to


exports.$inject = [
  "$state"
  "$rootScope"
  "$window"
  "$log"
  "$notifications"
]
