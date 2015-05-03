[![npm version](https://badge.fury.io/js/gulp-s18n.svg)](http://badge.fury.io/js/gulp-s18n) [![Build Status](https://travis-ci.org/bitjson/gulp-s18n.svg)](https://travis-ci.org/bitjson/gulp-s18n) [![Coverage Status](https://coveralls.io/repos/bitjson/gulp-s18n/badge.svg?branch=master)](https://coveralls.io/r/bitjson/gulp-s18n?branch=master) [![Dependency Status](https://david-dm.org/bitjson/gulp-s18n.svg)](https://david-dm.org/bitjson/gulp-s18n) [![Stories in Ready](https://badge.waffle.io/bitjson/gulp-s18n.png?label=ready&title=Ready)](https://waffle.io/bitjson/gulp-s18n)

gulp-s18n
=========

A gulp plugin that wraps [s18n](https://github.com/bitjson/s18n), semantic localization for html.

Usage
-----

Localizes files for each locale in `locales`. Localized files are nested in a subdirectory for each locale. The `nativeLocale` and `locales` options are required.

```js
var gulp = require('gulp');
var s18n = require('gulp-s18n');

gulp.task('load-locales', function () {
  return gulp.src('locales/*.json')
    .pipe(s18n.setLocales('en'));
});

gulp.task('localize', ['set-locales'], function () {
  return gulp.src('src/**/*.html')
    .pipe(s18n())
    .pipe(gulp.dest('dist'))
});

gulp.task('default', ['localize']);
```

Extracting Locales (WIP)
------------------------

Simulating Translation (WIP)
----------------------------

Multiple Projects
-----------------

When localizing multiple projects with the same instance of gulp-s18n, it's possible to pass a `cacheId` option to the gulp-s18n.setLocales() and gulp-s18n() methods.

```js
var gulp = require('gulp');
var s18n = require('gulp-s18n');

gulp.task('load-locales-1', function () {
  return gulp.src('locales1/*.json')
    .pipe(s18n.setLocales('en', {
      cacheId: 'foo'
    }));
});

gulp.task('localize-1', ['set-locales'], function () {
  return gulp.src('src1/**/*.html')
    .pipe(s18n({
      cacheId: 'foo'
    }))
    .pipe(gulp.dest('dist/src1'))
});

gulp.task('load-locales-2', function () {
  return gulp.src('locales2/*.json')
    .pipe(s18n.setLocales('en', {
      cacheId: 'bar'
    }));
});

gulp.task('localize-2', ['set-locales'], function () {
  return gulp.src('src2/**/*.html')
    .pipe(s18n({
      cacheId: 'bar'
    }))
    .pipe(gulp.dest('dist/src2'))
});

gulp.task('default', ['localize']);
```
