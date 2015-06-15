debug       = require "gulp-debug"
runSequence = require "run-sequence"
coffeeify   = require "gulp-coffeeify"
gutil       = require "gulp-util"
hashsum     = require "gulp-hashsum"
md5         = require "gulp-md5"
rename      = require "gulp-rename"
uglifyJS    = require "gulp-uglifyjs"
foreach     = require "gulp-foreach"

module.exports = (gulp, config) -> ->
  gulp.src config.jsSrc
  # For each file, minify it back into itself..
  .pipe foreach (stream, file) ->
    stream
    .pipe uglifyJS file
    .pipe gulp.dest config.jsDest
