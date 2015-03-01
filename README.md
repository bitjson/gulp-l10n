[![Build Status](https://travis-ci.org/bitjson/gulp-l10n.svg)](https://travis-ci.org/bitjson/gulp-l10n)
[![Dependency Status](https://david-dm.org/bitjson/gulp-l10n.svg)](https://david-dm.org/bitjson/gulp-l10n)
[![npm version](https://badge.fury.io/js/gulp-l10n.svg)](http://badge.fury.io/js/gulp-l10n)

# gulp-l10n

A plugin for localizing html.

[![Stories in Ready](https://badge.waffle.io/bitjson/gulp-l10n.png?label=ready&title=Ready)](https://waffle.io/bitjson/gulp-l10n)

## extractLocale()

Parse and extract localizable strings from html. Passes on a single `LOCALE.json`, where LOCALE is the nativeLocale.

```js
var gulp = require('gulp');
var l10n = require('gulp-l10n');

gulp.task('extract-locale', function () {
  return gulp.src('src/**/*.html')
    .pipe(l10n.extractLocale())
    .pipe(gulp.dest('locales'));
});
```

### options

```js
// defaults included below

.pipe(l10n.extractLocale({
    // localize the contents of all of the following attributes
    attributes: ['alt', 'title'],

    // localize the contents of all elements with the following attributes
    directives: ['localize'],

    // localize the contents of all of the following elements
    elements: ['title', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],

    // algorithm to hash each string
    hashAlgorithm: 'md5',

    // length at which to trim each hash
    hashLength: 8,

    // by default, the locale is written to the stream as `en.json`
    nativeLocale: 'en'
  }))
```

## localize()

Localizes files for each locale in `locales`. Localized files are nested in a subdirectory for each locale. The `nativeLocale` and `locales` options are required.

```js
var gulp = require('gulp');
var l10n = require('gulp-l10n');

gulp.task('localize', function () {
  return gulp.src('src/**/*.html')
    .pipe(l10n.localize({
      nativeLocale: 'locales/en.json',
      locales: 'locales/*.json'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['localize']);

```
### options

```js
.pipe(l10n.localize({
    // Required: glob of locales to use in localizing files
    locales: 'locales/*.json',

    // Required: path of nativeLocale file
    nativeLocale: 'locales/en.json'
  }))
```



## simulateTranslation()

This is a utility to quickly simulate translation of the native locale to a list of `locales`.

```js
var gulp = require('gulp');
var l10n = require('gulp-l10n');

gulp.task('simulate-translations', function () {
  return gulp.src('locales/en.json')
    .pipe(l10n.simulateTranslation())
    .pipe(gulp.dest('locales'));
});
```

### options

```js
.pipe(l10n.simulateTranslation({
    // dictionary of strings and string replacements, e.g.:
    // before: 'This is <a href="/">a test</a> string.'
    // after:  'Thís ís <a href="/">á tést</a> stríng.'
    dictionary: {
      'a': 'á',
      'e': 'é',
      'i': 'í',
      'o': 'ó',
      'u': 'ú'
    },

    // create the following simulated locales
    // defaults to: `de.json`, `es.json`, `fr.json`
    locales: ['de', 'es', 'fr']
  }))
```
