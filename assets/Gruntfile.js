module.exports = function (grunt) {
	"use strict";

	/*! Load grunt modules */
	grunt.loadNpmTasks("grunt-browserify");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-sass");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-notify");

	grunt.initConfig({
		/*! JS browserify options */
		browserify: {
			app: {
				dest: "../server/public/javascripts/app.js",
				src: "javascripts/entry.js",
				options: {
					basedir: "javascripts/",
					browserifyOptions : { debug: true, }
				},
			}
		},


		/*! Compile and Minify the SASS files. */
		sass: {
			style: {
				files: {
					"../server/public/stylesheets/style.css" : "stylesheets/style.scss",
					"../server/public/stylesheets/redactor.css" : "stylesheets/redactor.scss",
				},
				options: { style: "compressed" },
			},
		},


		/*! Grunt watch rules */
		watch: {
			css: {
				files: ["stylesheets/**/*.scss"],
				options: { livereload: true },
				tasks: ["css", "notify_hooks", "notify:css"],
			},
			js: {
				files: ["javascripts/**/*.js", "javascripts/**/*.html"],
				tasks: ["js", "notify_hooks", "notify:js"]
			}
		},


		/*! Add LICENSE(s) to the Javascripts/CSS files */
		concat: {
			css: {
				dest: "../server/public/stylesheets/style.css",
				src: [
					"LICENSE",
					"../server/public/stylesheets/style.css",
				]
			},
			js: {
				dest: "../server/public/javascripts/app.min.js",
				src: [
					"LICENSE",
					"../server/public/javascripts/app.min.js",
				]
			}
		},


		uglify: {
			app: {
				files: {
					"../server/public/javascripts/app.min.js" : [
						"../server/public/javascripts/app.js",
					]
				}
			}
		},


		/*! Grunt notification options */
		notify: {
			js: {
				options: {
					title: "JS Compiled",
					message: "Javascript source files compiled successfully",
				}
			},
			css: {
				options: {
					title: "CSS Compiled",
					message: "CSS files compiled successfully",
				}
			},
			all: {
				options: {
					title: "All Compiled",
					message: "Javascript & SASS files compiled successfully",
				}
			},
		},
		notify_hooks: {
			options: {
				enabled: true,
				success: true,
				duration: 2
			}
		}
	});

	/*! Custom Grunt task definitions */
	grunt.registerTask("css", "Compiles the CSS files", function() {
		grunt.task.run(["sass"]);
	});
	grunt.registerTask("js", "Compiles the JS files", function() {
		grunt.task.run(["browserify"]);
	});

	/*! This task is for creating the files minified for the production ../server */
	grunt.registerTask("deploy", "Creates all the files for production",
		function() {
			grunt.task.run(["default", "uglify", "concat"]);
		}
	);

	/*! Set default grunt task */
	grunt.registerTask("default", ["css", "js" , "notify:all"]);
};