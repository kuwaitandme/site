concat         = require "gulp-concat"
debug          = require "gulp-debug"
gulpIgnore     = require "gulp-ignore"
mainBowerFiles = require "main-bower-files"
uglify         = require "gulp-uglifyjs"


module.exports = (gulp, config) -> ->
  gulp.src mainBowerFiles()
  .pipe gulpIgnore.include "*.js"
  .pipe uglify config.targetFilename
  .pipe gulp.dest config.dest
