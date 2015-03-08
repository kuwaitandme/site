var gulp = require('gulp');
var coffeeify = require('gulp-coffeeify');
var rename = require('gulp-rename');

module.exports = function() {

  gulp.src('javascripts/entry.coffee')
    .pipe(coffeeify({
      options: {
        debug: true, // source map
        // paths: [__dirname + '/node_modules', __dirname + '/src/coffee']
      }
    }))
    .pipe(rename('app.js'))
    .pipe(gulp.dest('../server/public/javascripts/build'));
}