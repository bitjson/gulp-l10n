'use strict';

var l10n = require('../');
var assert = require('assert');
var gutil = require('gulp-util');

describe('gulp-l10n', function() {

  it('should have an extractLocale method', function(){
    assert.equal(typeof l10n, 'object');
    assert.equal(typeof l10n.extractLocale, 'function');
  });

  describe('extractLocale()', function() {

    it('should extract locale strings from attributes', function(done) {
      var stream = l10n.extractLocale({
        attributes: ['alt', 'title', 'data-custom']
      });
      var test = new gutil.File({
        contents: new Buffer('<html><body><img src="doesnotexist.gif" alt="contents of alt attribute" title="contents of title attribute" data-custom="custom attribute"></body></html>')
      });
      stream.once('data', function(file) {
        assert(file.isBuffer());
        assert.deepEqual(JSON.parse(String(file.contents)), {
          "6cf62aab":"contents of alt attribute",
          "65069d93":"contents of title attribute",
          "89f8af89":"custom attribute"
        });
      });
      stream.on('end', done);
      stream.write(test);
      stream.end();
    });

  });

  it('should have a localize method', function(){
    assert.equal(typeof l10n, 'object');
    assert.equal(typeof l10n.localize, 'function');
  });

  describe('localize()', function() {

  });

  it('should have a simulateTranslation method', function(){
    assert.equal(typeof l10n, 'object');
    assert.equal(typeof l10n.simulateTranslation, 'function');
  });

  describe('simulateTranslation()', function() {

  });

});
