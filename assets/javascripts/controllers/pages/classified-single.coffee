module.exports = ['$scope', '$routeParams', 'model:classified', ($scope, $routeParams, classified) ->
	@name = '[page:classified-single]'

	console.log @name, "initializing"
	console.debug @name, "routeParams", $routeParams

	xhr = classified.get $routeParams.id
	xhr.success (result) -> $scope.classified = result
]