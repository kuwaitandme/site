exports = module.exports = ($scope) ->

  isClosed = true
  classes = $scope.classes = {}

  set = (value) ->
    isClosed = value
    $scope.classes["is-closed"] = isClosed
    $scope.classes["is-open"] = !isClosed
    console.log $scope.classes

  $scope.$on "hamburger:open", -> set false
  $scope.$on "hamburger:close", -> set true

###
  $('document').ready(function () {
    var trigger = $('#hamburger'),
        isClosed = true;

    trigger.click(function () {
      burgerTime();
    });

    function burgerTime() {
      if (isClosed == true) {
        trigger.removeClass('is-open');
        trigger.addClass('is-closed');
        isClosed = false;
      } else {
        trigger.removeClass('is-closed');
        trigger.addClass('is-open');
        isClosed = true;
      }
    }

  });###

exports.$inject = ["$scope"]
