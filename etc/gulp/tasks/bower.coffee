concat         = require "gulp-concat"
debug          = require "gulp-debug"
gulpIgnore     = require "gulp-ignore"
mainBowerFiles = require "main-bower-files"


module.exports = (gulp, config) -> ->
  gulp.src mainBowerFiles()
  # .pipe debug()
  .pipe gulpIgnore.include "*.js"
  .pipe concat config.targetFilename
  .pipe gulp.dest config.dest
