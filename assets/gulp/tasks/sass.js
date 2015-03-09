var sass = require('gulp-sass');
var gutil = require('gulp-util');

module.exports = function(gulp) {

	gulp.src('./stylesheets/style.scss')
		.pipe(sass({ errLogToConsole: true, sourceComments: 'map' }))
		.pipe(gulp.dest('../server/public/stylesheets/build'));
}