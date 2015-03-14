dest = './build'
src = './src'
module.exports =
	browserSync: server: baseDir: dest
	sass:
		src: src + '/sass/**/*.{sass,scss}'
		dest: dest
		settings:
			indentedSyntax: true
			imagePath: 'images'
	images:
		src: src + '/images/**'
		dest: dest + '/images'
	markup:
		src: src + '/htdocs/**'
		dest: dest
	iconFonts:
		name: 'Gulp Starter Icons'
		src: src + '/icons/*.svg'
		dest: dest + '/fonts'
		sassDest: src + '/sass'
		template: './gulp/tasks/iconFont/template.sass.swig'
		sassOutputName: '_icons.sass'
		fontPath: 'fonts'
		className: 'icon'
		options:
			fontName: 'Post-Creator-Icons'
			appendCodepoints: true
			normalize: false
	browserify: bundleConfigs: [
		{
			entries: src + '/javascript/global.coffee'
			dest: dest
			outputName: 'global.js'
			extensions: [
				'.coffee'
				'.hbs'
			]
			require: [
				'jquery'
				'backbone/node_modules/underscore'
			]
		}
		{
			entries: src + '/javascript/page.js'
			dest: dest
			outputName: 'page.js'
			external: [
				'jquery'
				'underscore'
			]
		}
	]
	production:
		cssSrc: dest + '/*.css'
		jsSrc: dest + '/*.js'
		dest: dest
