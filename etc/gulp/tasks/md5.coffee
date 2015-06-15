md5       = require "gulp-md5"

module.exports = (gulp, config) -> ->
  gulp.src config.src
  .pipe md5()
  .pipe gulp.dest config.dest
