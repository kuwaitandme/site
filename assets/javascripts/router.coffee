module.exports = (app) ->
	@name = "[router]"
	console.log @name, "initializing"

	app.config ($routeProvider, $locationProvider) ->
		# console.log $routeProvider, $locationProvider
		# $locationProvider.html5Mode true
		$routeProvider.when "/",
			controller: "page:landing"
			templateUrl: "landing"
		# $routeProvider.when "/classified/:id",
		# 	controller: "page:classified-single"
		# 	templateUrl: "classified/single.html"
		# $routeProvider.otherwise redirectTo: "/"
		# $routeProvider.when "/", controller: "PageCtrl"
			# templateUrl: "chapter.html",
			#