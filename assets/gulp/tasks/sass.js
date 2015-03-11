var sass = require('gulp-sass');
var gutil = require('gulp-util');
var watch = require('gulp-watch');

module.exports = function(gulp) {

	function task () {
		gulp.src('./stylesheets/style.scss')
			.pipe(sass({ errLogToConsole: true, sourceComments: 'map' }))
			.pipe(gulp.dest('../public/stylesheets/build'));
	}


	/* run once, then watch */
	task();
	gulp.task('sass', task);
	gulp.watch('stylesheets/**/*.scss', ['sass']);
}