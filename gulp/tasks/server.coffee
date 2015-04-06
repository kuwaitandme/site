coffee     = require 'gulp-coffee'
debug      = require('gulp-debug')
gulpIgnore = require 'gulp-ignore'
rename     = require 'gulp-rename'
uglify     = require 'gulp-uglifyjs'

module.exports = (gulp, config) ->
  task = ->
    gulp.src config.footer.src
    .pipe coffee()
    .pipe gulp.dest config.footer.dest
    .pipe gulpIgnore.include "**/*production.js"
    # .pipe debug()
    .pipe uglify    config.footer.filenameMin
    .pipe gulp.dest config.footer.dest

  gulp.task "server", -> task()