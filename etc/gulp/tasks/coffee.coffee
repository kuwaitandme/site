coffeeify = require "gulp-coffeeify"
gutil     = require "gulp-util"
hashsum   = require "gulp-hashsum"
md5       = require "gulp-md5"
rename    = require "gulp-rename"
uglify    = require "gulp-uglifyjs"

module.exports = (gulp, config) -> ->
  gulp.src config.src
  .pipe (coffeeify options: debug: true).on "error", gutil.log
  .pipe rename config.targetFilename
  .pipe gulp.dest config.dest
