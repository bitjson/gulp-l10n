[![npm version](https://badge.fury.io/js/gulp-l10n.svg)](https://www.npmjs.com/package/gulp-l10n) [![Build Status](https://travis-ci.org/bitjson/gulp-l10n.svg)](https://travis-ci.org/bitjson/gulp-l10n) [![Coverage Status](https://coveralls.io/repos/bitjson/gulp-l10n/badge.svg?branch=master)](https://coveralls.io/r/bitjson/gulp-l10n?branch=master) [![Dependency Status](https://david-dm.org/bitjson/gulp-l10n.svg)](https://david-dm.org/bitjson/gulp-l10n) [![Stories in Ready](https://badge.waffle.io/bitjson/gulp-l10n.png?label=ready&title=Ready)](https://waffle.io/bitjson/gulp-l10n)

# gulp-l10n
A gulp plugin that wraps [s18n](https://github.com/bitjson/s18n) and provides simple tooling for localizing html. Perfect for static generated sites and applications.

By default, this plugin generates localized html files and outputs them to a subdirectory for each locale, a popular pattern for localizing web content. For example: when `example.com/about` is localized with the `de` locale, it is placed at `example.com/de/about`.

# Usage

```js
var gulp = require('gulp');
var l10n = require('gulp-l10n');

// Prior to localization, pipe your locales to the setLocales method

gulp.task('load-locales', function () {
  return gulp.src('locales/*.json')
    .pipe(l10n.setLocales());
});

// Files piped to the plugin are localized and cloned to a separate subdirectory
// for each locale. e.g.: 'index.html' > 'de/index.html'

gulp.task('localize', ['load-locales'], function () {
  return gulp.src('src/**/*.html')
    .pipe(l10n())
    .pipe(gulp.dest('dist'))
});

gulp.task('default', ['localize']);
```

## Extracting Locales for Translation
The Extract method accepts an `s18n extract` options object. See [s18n's extract options](https://github.com/bitjson/s18n#extract-options) for full documentation and defaults.

```js
var gulp = require('gulp');
var l10n = require('gulp-l10n');

var opts = {
  elements: ['title', 'p', 'h1'],
  attributes: ['alt', 'title'],
  directives: 'translate=yes',
  attributeSetter: 'translate-attrs'
};

gulp.task('extract-locales', function () {
  return gulp.src('src/**/*.html')
    .pipe(l10n.extract(opts))
    .pipe(gulp.dest('locales'));
});
```

### Continuous Localization
To automatically extract new strings for translation, simply add your locale extraction task to your build process.

```js
var gulp = require('gulp');
var l10n = require('gulp-l10n');

gulp.task('extract-locales', function () {
  return gulp.src('app/**/*.html')
    .pipe(l10n.extract())
    .pipe(gulp.dest('locales'));
});

gulp.task('load-locales', ['extract-locales'], function () {
  return gulp.src('locales/*.json')
    .pipe(l10n.setLocales());
});

gulp.task('localize', ['load-locales'], function () {
  return gulp.src('app/**/*.html')
    .pipe(l10n())
    .pipe(gulp.dest('dist'));
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
    .pipe(l10n.setLocales({
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

## Testing Localization
To simulate translation (for testing purposes), you can use the s18n CLI's `$ s18n map`. See s18n [Testing Localization](https://github.com/bitjson/s18n#testing-localization) for more information.

## Rewriting `href`s
The `hrefRewrite` option accepts a function which transforms the contents of all `a` element `href` attributes in each locale. This is ideal for completely static sites, where little or no server logic is being employed to serve appropriate locales to visitors (eg: GitHub Pages). This rewriting allows users to navigate the static site within their chosen locale.

```js
gulp.task('localize', ['load-locales'], function () {
  return gulp.src('app/**/*.html')
    .pipe(l10n({
      hrefRewrite: function(href, locale){
        if(href.charAt(0) === '/'){
          return '/' + locale + href;
        }
        else {
          return href;
        }
      }
    }))
    .pipe(gulp.dest('dist'));
});
```

### Rewriting Other URLs and Attributes
The `hrefRewrite` option is deliberately limited in scope to `a` element `href`s. To localize other URLs, like `image src`s, `link href`s, and other html attributes, it's recommended that [s18n](https://github.com/bitjson/s18n) Attribute Setters and Cancelers be used. This ensures all localization information is available in locale files, rather than relying upon project configuration.

## Multiple Projects
When localizing multiple projects with the same instance of gulp-l10n, it's possible to pass a `cacheId` option to the gulp-l10n.setLocales() and gulp-l10n() methods. The default `cacheId` is `default`.

```js
var gulp = require('gulp');
var l10n = require('gulp-l10n');

gulp.task('load-locales-1', function () {
  return gulp.src('locales1/*.json')
    .pipe(l10n.setLocales('en', {
      cacheId: 'foo'
    }));
});

gulp.task('localize-1', ['load-locales-1'], function () {
  return gulp.src('src1/**/*.html')
    .pipe(l10n({
      cacheId: 'foo'
    }))
    .pipe(gulp.dest('dist/src1'));
});

gulp.task('load-locales-2', function () {
  return gulp.src('locales2/*.json')
    .pipe(l10n.setLocales('en', {
      cacheId: 'bar'
    }));
});

gulp.task('localize-2', ['load-locales-2'], function () {
  return gulp.src('src2/**/*.html')
    .pipe(l10n({
      cacheId: 'bar'
    }))
    .pipe(gulp.dest('dist/src2'));
});

gulp.task('default', ['localize-1', 'localize-2']);
```

# API
The Node API as if the gulp-l10n plugin is assigned to the variable `l10n`.

```js
var l10n = require('gulp-l10n');
```

## l10n.extract()
Pipe html files to this method to semantically extract strings for translation.

This method clears the pipe and outputs only a single native locale – by default: `en.json`.

```js
  // inside a gulp task:

  var options = {
    native: 'de',
    elements: ['title', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'test'],
    attributes: ['alt', 'title', 'test']
  };

  return gulp.src('**/*.html')
    .pipe(l10n.extract( options ))
    .pipe(gulp.dest('locales'));
```

### Options
The `l10n.extract()` options object accepts all [s18n extract options](https://github.com/bitjson/s18n#extract), as well as the `gulp-l10n`-specific options below.

#### native
- **Accepts**: _String_
- **Default**: `'en'`

Set the locale code in which your website or application is authored. This is used in the file name of the native locale output by the method.

## l10n.setLocales()
Pipe locales through this method before piping html through l10n().

```js
  // inside a gulp task:

  var options = {
    native: 'de',
    cacheId: 'test'
  };

  return gulp.src('locales/*.json')
    .pipe(l10n.setLocales( options ));
```

### Options
The `l10n.setLocales()` method accepts an options object.

#### native
- **Accepts**: _String_
- **Default**: `'en'`

Set the s18n native locale. This is the locale in which your website or application is authored.

**Default**: `'en'`

#### cacheId
- **Accepts**: _String_
- **Default**: `'default'`

Set the locale cache in which the locale is saved. Allows for multiple distinct websites or applications to be separately translated by the same instance of gulp-l10n.

#### enforce
- **Accepts**: _String_
- **Default**: `'silent'`

Set the enforcement mode.

Mode       | Description
---------- | -------------------------------------
`'silent'` | Do not enforce localization.
`'warn'`   | Warn about missing localizations.
`'strict'` | Throw error on missing localizations.

## l10n()
Gulp plugin to localize html files using locales previously set with the setLocales method.

```js
  // inside a gulp task:

  var options = {
    cacheId: 'test',
    hrefRewrite: function(href, locale){
      if(href.charAt(0) === '/'){
        return '/' + locale + href;
      }
      else {
        return href;
      }
    }
  };

  return gulp.src('**/*.html')
    .pipe(l10n( options ))
    .pipe(gulp.dest('dist'));
```

### Options
The `l10n()` options object accepts all [s18n localization options](https://github.com/bitjson/s18n#localize), as well as the `gulp-l10n`-specific options below.

#### cacheId
- **Accepts**: _String_
- **Default**: `'default'`

Set the locale cache used in localizing html. Allows for multiple distinct websites or applications to be separately translated by the same instance of gulp-l10n.

#### hrefRewrite
- **Accepts**: _Function(`href`, `locale`)_, `null`
- **Default**: `null`

A function to transform all `href`s in each html document localized. The value of each href will be replaced by the value returned by this function. `Href`s will not be rewritten if this option is set to `null`.

Parameter | Description
--------- | -----------------------------------------------------------------------------------------------------------------------------------------------------------
`href`    | The original value of the `href` attribute currently being transformed.
`locale`  | The locale code of the locale currently being applied to the html document. This is also the name of the current locale's directory. (Eg: `en`, `de`, etc.)

#### outPath
- **Accepts**: _Function(`base`, `path`, `localeId`)_, `string`
- **Default**: `return path.replace(base, base + localeId + '/');`

A function to compute a custom output path for localized files.

Example for files of the form `index.de.html`

```js

  gulp.task('localize', function () {
    return gulp.src('*.html')
      .pipe(l10n({
        outPath: function (base, path, localeId) {
          return path.slice(0, -4) + localeId + ".html";
        }
      }))
      .pipe(gulp.dest(pkg.release));
  });
```

# Contributing
The default Gulp task watches all files and runs tests and code coverage.

```bash
$ npm install -g gulp
$ gulp
```

## Testing
This module strives to maintain passing tests with 100% coverage in every commit, and tests are run pre-commit. If you prefer, you can always skip this check with `git commit --no-verify` and squash WIP commits for pull requests later.

If you're unsure or would like help writing tests or getting to 100% coverage, please don't hesitate to open up a pull request so others can help!
