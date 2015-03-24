module.exports =
	routes: (router, base) ->
		(require './email')   .routes router, base + '/auth'
		(require './logout')  .routes router, base + '/auth'