'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var js = '*.js';
var tests = 'test/**/*.js';

gulp.task('default', ['test'], function(cb){
  gulp.watch([js, tests], ['test']);
});

gulp.task('test', function(cb){
  runSequence('jshint', 'mocha', cb);
});

gulp.task('jshint', function () {
  return gulp.src([js, tests])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('mocha', function () {
  return gulp.src(tests, {read: false})
        .pipe($.mocha({reporter: 'spec'}));
});
