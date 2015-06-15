"use strict";

require("coffee-script/register");
var runSequence = require("run-sequence");

var dependencies = [
  "bower",
  "checksum",
  "coffee",
  // "docs",
  "jade",
  "md5",
  "minify",
  "sass",
  "server",
  "watch"
];


var gulp = require("./etc/gulp")(dependencies);


gulp.task("build", ["coffee", "sass", "jade", "bower", "server"])

gulp.task("deploy", function (callback) {
  runSequence(
    "build",
    "minify",
    "md5",
    "checksum",
    callback);
});


gulp.task("default", function (callback) {
  runSequence(
    "build",
    "md5",
    "checksum",
    "watch",
    callback);
});

