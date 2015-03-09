module.exports = Backbone.View.extend
	events:
		'click .cl-title': 'toggleClassified'
		'click .search-button': 'submitSearch'

	initialize: (options) ->
		console.log '[view:landing] initializing'

		if options.$el then	@$el = options.$el

		app.loadResource 'masonry'
		@$topClassifieds = @$el.find('#top-classifieds .content')
		@$categoryList = @$el.find('#masonry-container .content')
		@$categoryList.hide()


	render: ->
		console.log '[view:landing] rendering'
		that = this
		@categories = app.models.categories.toJSON()
		@categoriesTemplate = _.template(@$el.find('#list-template').html())
		that.$categoryList.html ''

		# Render out each of the categories
		i = 0
		while i < @categories.length
			html = @categoriesTemplate(@categories[i])
			@$categoryList.append html
			i++


	postAnimation: ->
		@$categoryList.fadeIn()
		@setupMasonry()


	submitSearch: (event) ->
		event.preventDefault()
		$el = @$el.find('[name=\'keywords\']')
		text = $el.val()
		text.replace ' ', '+'
		console.log text
		app.goto '/classified/search/?keywords=' + text, 'classified-search', null


	toggleClassified: (e) ->
		$el = $(e.currentTarget).parent()
		$list = $el.find('.cl-list')
		if $list.height() == 0 then @openClassified $el, $list
		else @closeClassified()


	openClassified: ($el, $list) ->
		that = this
		@closeClassified()
		$el.addClass 'active'
		$list.css 'height', 'auto'
		height = $list.height()
		that.$categoryList.masonry()
		$list.height 0
		$list.stop().transition { height: height }, ->
			that.$categoryList.masonry()


	closeClassified: ->
		that = this
		$el = $('.cl-container')
		$el.removeClass 'active'
		$list = $el.find('.cl-list')
		$list.stop().transition { height: 0 }, ->
			that.$categoryList.masonry()

	# Initializes Masonry to arrange the top classifieds and bottom categories
	setupMasonry: ->
		that = this
		@$categoryList.masonry
			columnWidth: 10
			isAnimated: true
			isFitWidth: true
			itemSelector: '.cl-item'