coffee   = require "gulp-coffee"
gulpDoxx = require "gulp-doxx"
rename   = require "gulp-rename"


module.exports = (gulp, config) -> ->
  gulp.src config.frontend.src
    .pipe coffee()
    .pipe gulp.dest config.frontend.dest
    .pipe gulpDoxx
      title: "Kuwait & Me - Frontend"
      urlPrefix: config.hostname
    .pipe gulp.dest "."

  gulp.src config.backend.src
    .pipe coffee()
    .pipe gulp.dest config.backend.dest
    .pipe gulpDoxx
      title: "Kuwait & Me - Backend"
      urlPrefix: config.hostname
    .pipe gulp.dest "."
