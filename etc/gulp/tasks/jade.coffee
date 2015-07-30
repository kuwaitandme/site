gutil     = require "gulp-util"
jade      = require "gulp-jade"
concat    = require "gulp-concat"
template  = require "gulp-lodash-template"


module.exports = (gulp, config) -> ->
  gulp.src config.src
  .pipe (jade pretty: false).on "error", gutil.log
  .pipe template
    namespace: "JST"
    name: (file) -> (file.relative.split ".html")[0]
  .pipe concat config.targetFilename
  .pipe gulp.dest config.dest
