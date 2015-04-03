require('coffee-script/register');

var gulp = require('./gulp')([
	'coffee',
	'docs',
	'jade',
	'sass',
	'server',
	'watch'
]);


gulp.task('css', ['sass']);
gulp.task('css:minified', ['sass:minified']);
gulp.task('html', ['jade']);
gulp.task('html:minified', ['jade:minified']);
gulp.task('js', ['coffee']);
gulp.task('js:minified', ['coffee:minified']);

gulp.task('build', ['js', 'css', 'html']);
gulp.task('deploy', ['js:minified', 'css:minified', 'html:minified', 'server']);

gulp.task('default', ['build', 'watch']);