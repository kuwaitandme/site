var gulp = require('gulp');

var cache = require('gulp-cached');
var coffee = require('gulp-coffee');
var coffeeify = require('gulp-coffeeify');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var watch = require('gulp-watch');

module.exports = function() {

	gulp.task('coffeeify', function() {
  		gulp.src('javascripts/entry.coffee')
			.pipe(coffeeify({
				options: {
					debug: true, // source map
					// paths: [__dirname + '/node_modules', __dirname + '/src/coffee']
				}
			}))
			.pipe(rename('app.js'))
			.pipe(gulp.dest('../server/public/javascripts/build'));

		// gulp.src('javascripts/**/*.coffee')
		// 	// .pipe(cache('coffeeify-ing'))
		// 	.pipe(coffee({bare: true})).on('error', gutil.log)
		// 	.pipe(gulp.dest('../server/public/javascripts/build/coffeeify'));
	});

	gulp.watch('javascripts/**/*.coffee', ['coffeeify']);


	// gulp.src('javascripts/**/*.coffee')
	// 	.pipe(watch('*.coffee'))
	// 	.pipe(coffee({bare: true})).on('error', gutil.log)
	// 	.pipe(gulp.dest('../server/public/javascripts/build/coffeeify'));
}