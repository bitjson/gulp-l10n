'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var js = '*.js';
var tests = 'test/**/*.{js, json}';
var developing = false;

gulp.task('default', function(){
  developing = true;
  runSequence(['test', 'watch']);
});

gulp.task('watch', function(){
  gulp.watch([js, tests], ['test']);
});

gulp.task('test', function(cb){
  runSequence('jshint', 'mocha', cb);
});

gulp.task('jshint', function () {
  return gulp.src([js, tests])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!developing, $.jshint.reporter('fail')));
});

gulp.task('mocha', function () {
  return gulp.src(tests, {read: false})
        .pipe($.mocha({reporter: 'spec'}));
});
