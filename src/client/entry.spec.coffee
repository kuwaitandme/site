describe "controllers", ->
  scope = undefined
  beforeEach module "app"

  beforeEach inject ($rootScope) -> scope = $rootScope.$new()

  it "should define more than 5 awesome things", inject ($controller) ->
    expect(scope.awesomeThings).toBeUndefined()
    $controller "MainCtrl", $scope: scope
    expect(angular.isArray(scope.awesomeThings)).toBeTruthy()
    expect(scope.awesomeThings.length > 5).toBeTruthy()
