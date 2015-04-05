jade      = require 'gulp-jade'
rename    = require 'gulp-rename'
concat    = require 'gulp-concat'
template  = require 'gulp-template-compile'

module.exports = (gulp, config) ->
  task = (minify, dest) ->
    gulp.src config.src
    .pipe jade pretty: not minify
    .pipe template
      namespace: 'template'
      name: (file) -> (file.relative.split '.html')[0]
    .pipe concat dest
    .pipe gulp.dest config.dest

  gulp.task 'jade', -> task false, config.targetFilename
  gulp.task 'jade:minified', -> task true, config.targetFilenameMin