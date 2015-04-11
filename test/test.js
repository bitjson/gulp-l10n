'use strict';

var gulpS18n = require('../');
var path = require('path');
var assert = require('assert');
var streamAssert = require('stream-assert');
var gutil = require('gulp-util');
var gulp = require('gulp');


var fixtures = function(glob) {
  return path.join(__dirname, 'fixtures', glob);
};

describe('gulp-s18n()', function() {

  it('should be a method', function() {
    assert.equal(typeof gulpS18n, 'function');
  });

  it('should ignore null files', function(done) {
    var stream = gulpS18n();
    stream
      .pipe(streamAssert.length(0))
      .pipe(streamAssert.end(done));
    stream.write(new gutil.File());
    stream.end();
  });

  it('should error on streamed file', function(done) {
    gulp.src(fixtures('*'), {
        buffer: false
      })
      .pipe(gulpS18n())
      .on('error', function(err) {
        assert.equal(err.message, 'streaming not supported');
        done();
      });
  });

  it('should accept buffered files', function(done) {
    var stream = gulpS18n();
    var test = new gutil.File({
      contents: new Buffer('test')
    });
    stream.once('data', function(file) {
      // nothing yet
    });
    stream.on('end', done);
    stream.write(test);
    stream.end();
  });

});
