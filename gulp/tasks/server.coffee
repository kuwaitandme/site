coffee   = require 'gulp-coffee'
flatten  = require 'gulp-flatten'
gulpDoxx = require 'gulp-doxx'
rename   = require 'gulp-rename'
uglify   = require 'gulp-uglifyjs'


module.exports = (gulp, config) ->
  task = ->
    gulp.src config.footer.src
    .pipe coffee()
    .pipe gulp.dest config.footer.dest
    .pipe uglify    config.footer.filenameMin
    .pipe gulp.dest config.footer.dest

  gulp.task "server", -> task()