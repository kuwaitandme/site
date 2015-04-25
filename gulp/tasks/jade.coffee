jade      = require 'gulp-jade'
rename    = require 'gulp-rename'
concat    = require 'gulp-concat'
template  = require 'gulp-template-compile'
template  = require 'gulp-lodash-template'

module.exports = (gulp, config) ->
  task = (minify, dest) ->
    gulp.src config.src
    .pipe jade pretty: not minify
    .pipe template
      namespace: 'JST'
      name: (file) -> (file.relative.split '.html')[0]
      templateSettings:
        imports: { asd: 'asd'}
        # escape: 'asd'
    .pipe concat config.targetFilename
    .pipe gulp.dest config.dest

  gulp.task "jade", -> task()