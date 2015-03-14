coffee    = require 'gulp-coffee'
coffeeify = require 'gulp-coffeeify'
gutil     = require 'gulp-util'
rename    = require 'gulp-rename'
uglify    = require 'gulp-uglifyjs'

module.exports = (gulp, config) ->
	task = ->
		gulpPipe = gulp.src config.src
			.pipe (coffeeify options: debug: true).on('error', gutil.log)
			.pipe rename config.targetFilename
			.pipe gulp.dest config.dest
		gulpPipe


	gulp.task 'coffee', -> task()

	gulp.task 'coffee:minified', ->
		task()
			.pipe uglify    config.targetFilenameMin
			.pipe gulp.dest config.dest