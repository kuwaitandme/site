coffee    = require 'gulp-coffee'
coffeeify = require 'gulp-coffeeify'
gutil     = require 'gulp-util'
rename    = require 'gulp-rename'
uglify    = require 'gulp-uglifyjs'
watch     = require 'gulp-watch'

module.exports = (gulp) ->

	task = ->
		gulpPipe = gulp.src('javascripts/entry.coffee')
			.pipe(coffeeify(options: debug: true).on('error', gutil.log))
			.pipe(rename 'app.js')
			.pipe(gulp.dest '../public/javascripts/build')
		gulpPipe


	gulp.task 'coffee', -> task()

	gulp.task 'coffee:minified', ->
		task().pipe(uglify('app.min.js'))
			.pipe(gulp.dest '../public/javascripts/build')