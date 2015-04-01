coffee    = require 'gulp-coffee'
markdox = require "gulp-markdox"
rename = require("gulp-rename")
gulpDoxx = require 'gulp-doxx'
flatten = require('gulp-flatten');

module.exports = (gulp, config) ->
	task = ->
		gulp.src config.frontend.src
			.pipe coffee()
			.pipe gulp.dest config.frontend.dest
			.pipe gulpDoxx
				title: 'Kuwait & Me - Frontend'
				urlPrefix: config.hostname
			.pipe gulp.dest '.'

		gulp.src config.backend.src
			.pipe coffee()
			.pipe gulp.dest config.backend.dest
			.pipe gulpDoxx
				title: 'Kuwait & Me - Backend'
				urlPrefix: config.hostname
			.pipe gulp.dest '.'

	gulp.task "docs", -> task()