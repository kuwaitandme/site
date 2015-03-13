# categories = require './categories'
# locations  =

# Model parent classes to be referred here. This allows any other function
# to easily instantiate the required model by just referencing from this
# module
module.exports =
	classified:  require './classified'
	classifieds: require './classifieds'
	user:        require "./user"

	initialize: (@config) -> console.log '[model] initializing'

	start: ->
		console.log '[model] starting'

		# Initialize the category and location model and populate them with
		# their values.
		#
		# Since these models never change, we instantiate them first and
		# save their instance as properties of this module.
		#
		# NOTE: other models are not instantiated and only these ones are.
		@categories = new (require './categories')
		@locations  = new (require './locations')

		@categories.fetch()
		@locations.fetch()

		@currentUser = new @user
		@currentUser.fetch()