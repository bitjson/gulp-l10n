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

Extracting Locales
------------------

Simulating Translation
----------------------
