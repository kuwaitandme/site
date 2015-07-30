globbing  = require "gulp-css-globbing"
gutil     = require "gulp-util"
rename    = require "gulp-rename"
sass      = require "gulp-sass"
uglifycss = require "gulp-uglifycss"


module.exports = (gulp, config) -> ->
  gulp.src config.src
  .pipe globbing extensions: [".sass"]
  .pipe (sass errLogToConsole: true, indentedSyntax: true).on "error", gutil.log
  .pipe uglifycss()
  .pipe rename config.targetFilename
  .pipe gulp.dest config.dest
