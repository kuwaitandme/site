globbing  = require "gulp-css-globbing"
rename    = require "gulp-rename"
sass      = require "gulp-sass"
uglifycss = require "gulp-uglifycss"


module.exports = (gulp, config) -> ->
  gulp.src config.src
  .pipe globbing extensions: [".sass"]
  .pipe sass
    errLogToConsole: true
    indentedSyntax: true
  .pipe uglifycss()
  .pipe rename config.targetFilename
  .pipe gulp.dest config.dest
