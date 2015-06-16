coffeeify   = require "gulp-coffeeify"
foreach     = require "gulp-foreach"
uglifyJS    = require "gulp-uglifyjs"

module.exports = (gulp, config) -> ->
  gulp.src config.jsSrc
  # For each file, minify it back into itself..
  .pipe foreach (stream, file) ->
    stream
    .pipe uglifyJS file
    .pipe gulp.dest config.jsDest
