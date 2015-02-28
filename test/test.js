'use strict'

var l10n = require('../');
var assert = require('assert');

describe('gulp-l10n', function() {

  it('should have an extractLocale method', function(){
    assert.equal(typeof l10n, 'object');
    assert.equal(typeof l10n.extractLocale, 'function');
  });

  describe('extractLocale()', function() {

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
