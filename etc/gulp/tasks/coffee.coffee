coffeeify = require "gulp-coffeeify"
gutil     = require "gulp-util"
rename    = require "gulp-rename"

module.exports = (gulp, config) -> ->
  gulp.src config.src
  .pipe (coffeeify options: debug: true).on "error", gutil.log
  .pipe rename (path) ->
    path.basename = path.dirname
    path.dirname = ""
  .pipe gulp.dest config.dest
