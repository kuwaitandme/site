module.exports = (app) ->
	console.log "[controllers] initializing"

	app.controller 'page:landing',              require './pages/landing'
	# app.controller 'page:classified-single', require './pages/classified-single'
	app.controller 'partial:classified-list',   require './partials/classified-list'