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


gulp.task("build", function (callback) {
  runSequence(
    ["coffee", "sass", "jade", "bower"],
    "md5",
    "checksum",
    callback);
});

gulp.task("deploy", function (callback) {
  runSequence(
    ["coffee", "sass", "jade", "bower", "server"],
    "minify",
    "md5",
    "checksum",
    callback);
});


gulp.task("default", ["build", "watch"]);
