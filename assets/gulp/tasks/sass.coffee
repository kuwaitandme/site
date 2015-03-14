sass      = require 'gulp-sass'
rename    = require 'gulp-rename'
uglifycss = require 'gulp-uglifycss'

module.exports = (gulp) ->

	task = ->
		gulpPipe = gulp.src './stylesheets/style.scss'
			.pipe sass
				errLogToConsole: true
				sourceComments: 'map'
			.pipe gulp.dest '../public/stylesheets/build'

		gulpPipe

	gulp.task 'sass', -> task()

	gulp.task 'sass:minified', ->
		task()
			.pipe uglifycss()
			.pipe rename 'style.min.css'
			.pipe gulp.dest '../public/stylesheets/build'