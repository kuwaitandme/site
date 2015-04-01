require('coffee-script/register');

var gulp = require('./assets/gulp')([
	'coffee',
	'sass',
	'watch',
	'docs'
]);

gulp.task('css', ['sass']);
gulp.task('css:minified', ['sass:minified']);
gulp.task('js', ['coffee']);
gulp.task('js:minified', ['coffee:minified']);


gulp.task('build', ['js', 'css']);
gulp.task('deploy', ['js:minified', 'css:minified']);

gulp.task('default', ['build', 'watch']);