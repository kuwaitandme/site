hashsum   = require "gulp-hashsum"


module.exports = (gulp, config) -> ->
  gulp.src config.src
  .pipe hashsum
    dest: config.dest
    hash: config.hash
    filename: config.filename
