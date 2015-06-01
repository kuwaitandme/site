concat         = require "gulp-concat"
debug          = require "gulp-debug"
gulpIgnore     = require "gulp-ignore"
mainBowerFiles = require "main-bower-files"
uglify         = require "gulp-uglifyjs"


module.exports = (gulp, config) ->
  gulp.task "bower", ->
    gulp.src mainBowerFiles()
    .pipe debug()
    .pipe gulpIgnore.include "*.js"
    # .pipe concat config.targetFilename
    .pipe uglify config.targetFilename
    .pipe gulp.dest config.dest
