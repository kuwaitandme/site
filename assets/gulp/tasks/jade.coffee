jade      = require 'gulp-jade'
rename    = require 'gulp-rename'
concat    = require 'gulp-concat'
template  = require 'gulp-template-compile'

module.exports = (gulp, config) ->
	gulp.task 'jade', ->
		gulp.src config.src
		.pipe jade pretty: true
		.pipe template
			namespace: 'template'
			name: (file) -> (file.relative.split '.html')[0] # strip out '.html'
		.pipe concat config.targetFilename
		.pipe gulp.dest config.dest