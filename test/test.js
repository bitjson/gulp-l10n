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

    it('should extract locale strings from configured attributes', function(done) {
      var stream = l10n.extractLocale({
        attributes: ['alt', 'title', 'data-custom']
      });
      var test = new gutil.File({
        contents: new Buffer('<img src="example.gif" alt="contents of alt attribute" title="contents of title attribute" data-custom="custom attribute">')
      });
      stream.once('data', function(file) {
        assert.deepEqual(JSON.parse(String(file.contents)), {
          '6cf62aab':'contents of alt attribute',
          '65069d93':'contents of title attribute',
          '89f8af89':'custom attribute'
        });
      });
      stream.on('end', done);
      stream.write(test);
      stream.end();
    });

    it('should extract locale strings from configured elements', function(done) {
      var stream = l10n.extractLocale({
        elements: ['p', 'custom']
      });
      var test = new gutil.File({
        contents: new Buffer('<h1>heading</h1><p>This is a test.</p><custom>Custom element</custom>')
      });
      stream.once('data', function(file) {
        assert.deepEqual(JSON.parse(String(file.contents)), {
          '74251aeb':'Custom element',
          '120ea8a2':'This is a test.'});
      });
      stream.on('end', done);
      stream.write(test);
      stream.end();
    });

    it('should extract locale strings from elements with configured directives', function(done) {
      var stream = l10n.extractLocale({
        directives : ['localize', 'custom']
      });
      var test = new gutil.File({
        contents: new Buffer('<div localize>This is a test.</div><div custom>custom directive</div>')
      });
      stream.once('data', function(file) {
        assert.deepEqual(JSON.parse(String(file.contents)), {
          '120ea8a2':'This is a test.',
          '6bd3b8ac':'custom directive'}
        );
      });
      stream.on('end', done);
      stream.write(test)
      stream.end()
    });

    it('should allow other hash algorithms', function(done) {
      var stream = l10n.extractLocale({
        hashAlgorithm : 'rmd160'
      });
      var test = new gutil.File({
        contents: new Buffer('<p>This is a test.</p>')
      });
      stream.once('data', function(file) {
        assert.deepEqual(JSON.parse(String(file.contents)), {
          '3c82f755':'This is a test.'
          });
      });
      stream.on('end', done);
      stream.write(test);
      stream.end();
    });

    it('should allow for different hash lengths', function(done) {
      var stream = l10n.extractLocale({
        hashLength : 13
      });
      var test = new gutil.File({
        contents: new Buffer('<p>This is a test.</p>')
      });
      stream.once('data', function(file) {
        assert.deepEqual(JSON.parse(String(file.contents)), {
          '120ea8a25e5d4':'This is a test.'
          });
      });
      stream.on('end', done);
      stream.write(test);
      stream.end();
    });

    it('should allow for a different nativeLocale', function(done) {
      var stream = l10n.extractLocale({
        nativeLocale : 'de'
      });
      var test = new gutil.File({
        contents: new Buffer('<p>Hallo, Welt!</p>')
      });
      stream.once('data', function(file) {
        assert.equal(file.path, 'de.json');
        assert.deepEqual(JSON.parse(String(file.contents)), {
          '2d78cd14': 'Hallo, Welt!'
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

    it('should simulate translation with a custom dictionary', function(done) {
      var stream = l10n.simulateTranslation({
        dictionary: {
          'a': 'á',
          'e': 'é',
          'i': 'í',
          'o': 'ó',
          'u': 'ú'
        }
      });
      var test = new gutil.File({
        contents: new Buffer('{"120ea8a2":"This is a test."}')
      });
      stream.once('data', function(file) {
        assert.deepEqual(JSON.parse(String(file.contents)), {'120ea8a2':'Thís ís á tést.'});
      });
      stream.on('end', done);
      stream.write(test);
      stream.end();
    });

    it('should not simulate translation of strings within html tags', function(done) {
      var stream = l10n.simulateTranslation({
        dictionary: {
          'a': 'á',
          'e': 'é',
          'i': 'í',
          'o': 'ó',
          'u': 'ú'
        }
      });
      var test = new gutil.File({
        contents: new Buffer(JSON.stringify({'99b4f068':'This is <a href="/">a test</a> string.'}))
      });
      stream.once('data', function(file) {
        assert.deepEqual(JSON.parse(String(file.contents)), {'99b4f068':'Thís ís <a href="/">á tést</a> stríng.'});
      });
      stream.on('end', done);
      stream.write(test);
      stream.end();
    });

  });

});
