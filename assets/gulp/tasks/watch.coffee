watch = require 'gulp-watch'

module.exports = (gulp, config) ->
	gulp.task 'watch', ->
		gulp.watch config.jsPattern, [ 'coffee' ]
		gulp.watch config.cssPattern, [ 'sass' ]