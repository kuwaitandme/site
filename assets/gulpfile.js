var gulp = require('./gulp')([
	'coffee',
	'sass'
	// 'minify'
	// 'compass',
	// 'images',
	// 'open',
	// 'watch',
	// 'serve']);
]);

gulp.task('css', ['sass']);
gulp.task('js', ['coffee']);
// gulp.task('license', [ ]);

// gulp.task('build', ['js', 'css', 'minify', 'license']);
gulp.task('build', ['js', 'css']);

// gulp.task('default', ['build', 'watch', 'serve', 'open']);
gulp.task('default', ['build']);