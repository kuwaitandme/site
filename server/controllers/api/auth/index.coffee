module.exports =
	routes: (router, base) ->
		(require './activate')  .routes router, base + '/auth'
		(require './forgot')    .routes router, base + '/auth'
		(require './login')     .routes router, base + '/auth'
		(require './logout')    .routes router, base + '/auth'
		(require './signup')    .routes router, base + '/auth'
		(require './reset')     .routes router, base + '/auth'