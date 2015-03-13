module.exports =
	routes: (router, base) ->
		base +='/auth'

		# (require './activate')  .routes router, base
		# (require './forgot')    .routes router, base
		# (require './login')     .routes router, base
		(require './logout')    .routes router, base
		# (require './signup')    .routes router, base
		# (require './reset')    .routes router, base