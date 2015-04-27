require('coffee-script/register');

var gulp = require('./gulp')([
	'coffee',
	'docs',
	'jade',
	'bower',
	'sass',
	'server',
	'watch'
]);


gulp.task('css', ['sass']);
gulp.task('css:minified', ['sass:minified']);
gulp.task('html', ['jade']);
gulp.task('js', ['coffee']);
gulp.task('js:minified', ['coffee:minified']);

gulp.task('minify', ['js:minified', 'css:minified'])
gulp.task('build', ['js', 'css', 'html', 'bower']);

// gulp.task('deploy', ['build', 'minify', 'server']);
gulp.task('deploy', ['build', 'minify']);
gulp.task('default', ['build', 'watch']);