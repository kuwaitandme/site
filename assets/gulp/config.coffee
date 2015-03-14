dest = './build'
src  = './src'

module.exports =
	coffee:
		dest:              '../public/javascripts/build'
		src:               './javascripts/entry.coffee'
		targetFilename:    'app.js'
		targetFilenameMin: 'app.min.js'

	sass:
		dest:              '../public/stylesheets/build'
		src:               './stylesheets/style.scss'
		targetFilename:    'style.css'
		targetFilenameMin: 'style.min.css'

	watch:
		cssPattern:  './stylesheets/*.scss'
		jsPattern:   './javascripts/*.js'