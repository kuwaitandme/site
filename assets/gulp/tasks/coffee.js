var gulp = require('gulp');

// var cache = require('gulp-caced');
var coffee = require('gulp-coffee');
var coffeeify = require('gulp-coffeeify');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var watch = require('gulp-watch');

module.exports = function() {

	function compile() {
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

	/* run once and then watch */
	compile();
	gulp.task('coffee', compile);
	gulp.watch('javascripts/**/*.coffee', ['coffee']);
}