var coffee = require('gulp-coffee');
var coffeeify = require('gulp-coffeeify');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var watch = require('gulp-watch');

module.exports = function(gulp) {

	function task () {
		gulp.src('javascripts/entry.coffee')
			.pipe(coffeeify({
				options: {
					debug: true, /* source map */
				}
			}).on('error', gutil.log))
			.pipe(rename('app.js'))
			.pipe(gulp.dest('../server/public/javascripts/build'));
	}


	/* run once, then watch */
	gulp.task('coffee', task);
	gulp.watch('javascripts/**/*.coffee', ['coffee']);
}