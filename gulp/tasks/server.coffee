coffee     = require 'gulp-coffee'
concat     = require 'gulp-concat'
debug      = require('gulp-debug')
gulpIgnore = require 'gulp-ignore'
rename     = require 'gulp-rename'
uglify     = require 'gulp-uglifyjs'

module.exports = (gulp, config) ->
  task = ->
    gulp.src config.footer.src
    .pipe coffee()
    .pipe debug()
    .pipe gulp.dest config.footer.dest

    gulp.src config.db.src
    .pipe coffee()
    .pipe concat config.db.filename
    .pipe gulp.dest config.db.dest

  gulp.task "server", -> task()