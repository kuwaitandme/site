globbing  = require "gulp-css-globbing"
rename    = require "gulp-rename"
sass      = require "gulp-sass"
uglifycss = require "gulp-uglifycss"


module.exports = (gulp, config) ->
  task = ->
    gulpPipe = gulp.src config.src
      .pipe globbing extensions: [".sass"]
      .pipe sass
        errLogToConsole: true
        indentedSyntax: true
      .pipe rename config.targetFilename
      .pipe gulp.dest config.dest
    gulpPipe

  taskMinified = ->
    task()
      .pipe uglifycss()
      .pipe rename config.targetFilenameMin
      .pipe gulp.dest config.dest


  gulp.task "sass", -> task()
  gulp.task "sass:minified", -> taskMinified()
