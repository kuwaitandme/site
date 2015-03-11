module.exports = Backbone.View.extend
	events:
		'click .search-button' : 'submitClick'
		'change select' : 'selectChange'


	initialize: (options) ->
		console.log '[view:landing] initializing'
		if options.$el then	@$el = options.$el

		# Setup DOM variables
		@$keywords = @$ "[name='keywords']"
		@$select = @$ "[name='category']"


	render: -> console.log '[view:landing] rendering'


	checkRedirect: -> false


	# This function redirects the app to the classified search page, with the
	# text in the search box set as the keywords in the GET query.
	submitClick: (event) ->
		event.preventDefault()

		# Get the keywords and covert it into a GET query
		text = @$keywords.val()
		text.replace ' ', '+'

		# Redirect the app to the classified search page.
		app.goto "/classified/search/?keywords=#{text}", 'classified-search'


	# This method performs the same function as the 'submitClick' method but
	# instead grabs the category too and then redirects the page.
	#
	# The page redirection happens automatically without the user pressing the
	# search button. This is a UX decision.
	selectChange: (event) ->
		cat = @$select.val()
		text = @$keywords.val()
		text.replace ' ', '+'

		# Generate the URL
		url = "/classified/search?category=#{cat}&keywords=#{text}"

		# Redirect the app to the classified search page.
		app.goto url, 'classified-search'