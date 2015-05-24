[![npm version](https://badge.fury.io/js/gulp-s18n.svg)](http://badge.fury.io/js/gulp-s18n) [![Build Status](https://travis-ci.org/bitjson/gulp-s18n.svg)](https://travis-ci.org/bitjson/gulp-s18n) [![Coverage Status](https://coveralls.io/repos/bitjson/gulp-s18n/badge.svg?branch=master)](https://coveralls.io/r/bitjson/gulp-s18n?branch=master) [![Dependency Status](https://david-dm.org/bitjson/gulp-s18n.svg)](https://david-dm.org/bitjson/gulp-s18n) [![Stories in Ready](https://badge.waffle.io/bitjson/gulp-s18n.png?label=ready&title=Ready)](https://waffle.io/bitjson/gulp-s18n)

gulp-s18n (WIP)
===============

A gulp plugin that wraps [s18n](https://github.com/bitjson/s18n) and provides simple automation for localizing html. Perfect for static generated sites and applications.

This plugin localizes html files and outputs them to a subdirectory for each locale, a popular pattern for localizing web content. For example: when `example.com/about` is localized with the `de` locale, it is placed at `example.com/de/about`.

Usage
=====

```js
var gulp = require('gulp');
var s18n = require('gulp-s18n');

// Prior to localization, pipe your locales to the setLocales method

gulp.task('load-locales', function () {
  return gulp.src('locales/*.json')
    .pipe(s18n.setLocales());
});

// Files piped to the plugin are localized and cloned to a separate subdirectory
// for each locale. e.g.: 'index.html' > 'de/index.html'

gulp.task('localize', ['load-locales'], function () {
  return gulp.src('src/**/*.html')
    .pipe(s18n())
    .pipe(gulp.dest('dist'))
});

gulp.task('default', ['localize']);
```

Extracting Locales for Translation
----------------------------------

The Extract method accepts an s18n extract options object. See [s18n's extract method](https://github.com/bitjson/s18n#extract) for more information.

```js
var gulp = require('gulp');
var s18n = require('gulp-s18n');

gulp.task('extract-locales', function () {
  return gulp.src('src/**/*.html')
    .pipe(s18n.extract())
    .pipe(gulp.dest('locales'));
});
```

### Continuous Localization

To automatically extract new strings for translation, simply add your locale extraction task to your build process.

```js
var gulp = require('gulp');
var s18n = require('gulp-s18n');

gulp.task('extract-locales', function () {
  return gulp.src('app/**/*.html')
    .pipe(s18n.extract())
    .pipe(gulp.dest('locales'));
});

gulp.task('load-locales', ['extract-locales'], function () {
  return gulp.src('locales/*.json')
    .pipe(s18n.setLocales());
});

gulp.task('localize', ['load-locales'], function () {
  return gulp.src('src/**/*.html')
    .pipe(s18n())
    .pipe(gulp.dest('dist'))
});

gulp.task('prepare', ['extract-locales']);
gulp.task('default', ['localize']);
```

### Enforcing Localization

The enforce option of the `setLocales` method provides a way to warn or error when strings are not translated. With `options.enforce` set to `warn`, when any locale is missing a string from the `native` locale, setLocales will log the problem. With `options.enforce` set to `strict`, an error will be thrown.

```js
...

gulp.task('load-locales', ['extract-locales'], function () {
  return gulp.src('locales/*.json')
    .pipe(s18n.setLocales({
      native: 'en',
      enforce: 'warn'
    }));
});

...
```

#### Example:

`locales/en.json`:

```json
  {
    "37b51d19": "bar",
    "acbd18db": "foo"
  }
```

`locales/de.json`:

```json
  {
    "37b51d19": "bår"
  }
```

Will warn:

```bash
WARN: locale `de` is missing: `acbd18db`, native string: `foo`
```

Testing Localization
--------------------

To simulate translation (for testing purposes), you can use the s18n CLI's `$ s18n map`. See s18n [Testing Localization](https://github.com/bitjson/s18n#testing-localization) for more information.

Multiple Projects
-----------------

When localizing multiple projects with the same instance of gulp-s18n, it's possible to pass a `cacheId` option to the gulp-s18n.setLocales() and gulp-s18n() methods. The default `cacheId` is `default`.

```js
var gulp = require('gulp');
var s18n = require('gulp-s18n');

gulp.task('load-locales-1', function () {
  return gulp.src('locales1/*.json')
    .pipe(s18n.setLocales('en', {
      cacheId: 'foo'
    }));
});

gulp.task('localize-1', ['load-locales-1'], function () {
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

gulp.task('localize-2', ['load-locales-2'], function () {
  return gulp.src('src2/**/*.html')
    .pipe(s18n({
      cacheId: 'bar'
    }))
    .pipe(gulp.dest('dist/src2'))
});

gulp.task('default', ['localize-1', 'localize-2']);
```

API
===

The Node API as if the gulp-s18n plugin is assigned to the variable `s18n`.

```js
var s18n = require('gulp-s18n');
```

s18n( *options* )
-----------------

Gulp plugin to localize html files using locales previously set with the setLocales method.

### Options

The s18n() options object accepts all [s18n localization options](https://github.com/bitjson/s18n#localize).

#### options.cacheId *(String)*

Set the locale cache used in localizing html. Allows for multiple distinct websites or applications to be separately translated by the same instance of gulp-s18n.

**Default**: `default`

s18n.setLocales( *options* )
----------------------------

Pipe locales through this method before piping html through s18n().

### Options

#### options.native *(String)*

Set the s18n native locale. This is the locale in which your website or application is authored.

**Default**: `en`

#### options.cacheId *(String)*

Set the locale cache in which the locale is saved. Allows for multiple distinct websites or applications to be separately translated by the same instance of gulp-s18n.

**Default**: `default`

#### options.enforce *(String)*

Set the enforcement mode.

##### `silent`

##### `warn`

##### `strict`

**Default**: `silent`

s18n.extract( *options* )
=========================

Pipe html files to this method to semantically extract strings for translation. This method clears the pipe and outputs only a single native locale – by default: `en.json`.

### Options

The s18n.extract() options object accepts all [s18n extract options](https://github.com/bitjson/s18n#extract).

#### options.native *(String)*

Set the locale code in which your website or application is authored. This is used in the file name of the native locale output by the method.

**Default**: `en`

Contributing
============

The default Gulp task watches all files and runs tests and code coverage.

```bash
$ npm install -g gulp
$ gulp
```

Testing
-------

This module strives to maintain passing tests with 100% coverage in every commit, and tests are run pre-commit. If you prefer, you can always skip this check with `git commit --no-verify` and squash WIP commits for pull requests later.

If you're unsure or would like help writing tests or getting to 100% coverage, please don't hesitate to open up a pull request so others can help!
