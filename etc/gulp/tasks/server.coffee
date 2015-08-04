coffee     = require "gulp-coffee"
debug      = require "gulp-debug"
foreach    = require "gulp-foreach"
gulpIgnore = require "gulp-ignore"
rename     = require "gulp-rename"
uglifyJS   = require "gulp-uglifyjs"


module.exports = (gulp, config) -> ->
  gulp.src config.footer.src
  .pipe coffee()
  .pipe rename (path) -> path.dirname += "/build"
  .pipe gulp.dest config.footer.dest

  .pipe foreach (stream, file) ->
    stream.pipe uglifyJS file
    .pipe rename (path) ->
      path.extname = ".min.js"
    .pipe gulp.dest config.footer.dest
