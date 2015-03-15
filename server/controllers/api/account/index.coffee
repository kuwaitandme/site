module.exports =
	routes: (router, base) ->
		(require './manage')  .routes router, base + '/account'