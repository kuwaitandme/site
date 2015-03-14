watch = require 'gulp-watch'

module.exports = (gulp, config) ->
	gulp.task 'watch', ->
		gulp.watch 'javascripts/**/*.coffee', [ 'coffee' ]
		gulp.watch 'stylesheets/**/*.scss', [ 'sass' ]