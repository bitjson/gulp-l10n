'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var paths = ['*.js','test/**/*.js'];

gulp.task('default', ['jshint'], function(cb){
  gulp.watch([paths], ['jshint']);
});

gulp.task('jshint', function () {
  return gulp.src(paths)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});
