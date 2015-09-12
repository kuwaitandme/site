coffeeify = require "gulp-coffeeify"
gutil     = require "gulp-util"


module.exports = (gulp, config) -> ->
  gulp.src config.src
  .pipe (coffeeify options: debug: true).on "error", gutil.log
  .pipe gulp.dest config.dest