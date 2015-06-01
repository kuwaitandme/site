sass      = require "gulp-sass"
rename    = require "gulp-rename"
uglifycss = require "gulp-uglifycss"


module.exports = (gulp, config) ->
  task = ->
    gulpPipe = gulp.src config.src
      .pipe sass errLogToConsole: true
      .pipe rename config.targetFilename
      .pipe gulp.dest config.dest

    gulpPipe

  gulp.task "sass", -> task()

  gulp.task "sass:minified", ->
    task()
      .pipe uglifycss()
      .pipe rename config.targetFilenameMin
      .pipe gulp.dest config.dest
