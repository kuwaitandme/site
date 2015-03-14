module.exports =
	passport: require './passport'
	api:      require './api'
	helpers:  require './helpers'

	routes: (router) ->
		(require './api').routes(router, '/api')