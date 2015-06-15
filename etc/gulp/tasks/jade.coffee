jade      = require "gulp-jade"
rename    = require "gulp-rename"
concat    = require "gulp-concat"
template  = require "gulp-lodash-template"


module.exports = (gulp, config) -> ->
  gulp.src config.src
  .pipe jade pretty: false
  .pipe template
    namespace: "JST"
    name: (file) -> (file.relative.split ".html")[0]
  .pipe concat config.targetFilename
  .pipe gulp.dest config.dest
