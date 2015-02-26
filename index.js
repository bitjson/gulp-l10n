var through = require('through2');
var gutil = require('gulp-util');

const PLUGIN_NAME = 'gulp-l10n';

var htmlparser = require("htmlparser2");
var crypto = require('crypto');
var gulpL10n = {};

gulpL10n.extractLocale = function(opt) {
  var options = opt = opt || {};
  //localize the contents of all of the following elements
  options.elements = opt.elements || ['title', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  //localize the contents of all of the following attributes
  options.attributes = opt.attributes || ['alt', 'title'];
  //localize the contents of all elements with the following attributes
  options.directives = opt.directives || ['localize'];
  options.algorithm = opt.algorithm || 'md5';
  options.hashLength = opt.hashLength || 8;
  options.nativeLocale = opt.nativeLocale || 'en';

  var locale = {};

  function addFile(file, enc, cb){
    // ignore empty files
   if (file.isNull()) {
     cb();
     return;
   }
   if (file.isStream()) {
     cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not (yet) supported'));
     return;
   }
   if (file.isBuffer()) {
     parser.write(file.contents);
   }
    cb();
  }

  var parser = new htmlparser.Parser(new htmlparser.DomHandler(function(error, dom){
    if(error) {
      throw new gutil.PluginError(PLUGIN_NAME, error);
    }
    else {
      var strings = [];

      //extract strings from options.elements and elements with options.directives
      var elements = filterElementsByTagNames(dom, options.elements);
      elements = elements.concat(filterElementsByAttributes(dom, options.directives));
      for(var i = 0; i < elements.length; i++) {
        strings.push(htmlparser.DomUtils.getInnerHTML(elements[i]));
      }

      //extract strings from options.attributes
      strings = strings.concat(extractStringsFromAttributes(dom, options.attributes));

      // strings are ordered alphabetically for human readability & better source control
      // when localizing content, matches are found in reverse alphabetical order
      // to ensure longest matches (across strings with internal duplicates)
      strings.sort();

      for(var i = 0; i < strings.length; i++){
        locale[hash(strings[i], options.algorithm, options.hashLength)] = strings[i];
      }
    }
  }, {
    normalizeWhitespace: true
  }));

  function createLocaleFile(cb){
    parser.done();
    if (Object.keys(locale).length === 0) {
      cb();
      return;
    }
    this.push(new gutil.File({
      cwd: "",
      base: "",
      path: options.nativeLocale + '.json',
      contents: new Buffer(JSON.stringify(locale, null, '  '))
    }));
    cb();
  }

  function filterElementsByTagNames(dom, tagsArray) {
    var checkTags = function(elem){
      if(htmlparser.DomUtils.isTag(elem)){
        return tagsArray.indexOf(elem.name) !== -1;
      }
    };
    return htmlparser.DomUtils.filter(checkTags, dom);
  }

  function filterElementsByAttributes(dom, attributesArray) {
    var checkAttrs = function(elem){
      if(elem.attribs) {
        for(var i = 0; i < attributesArray.length; i++){
          if (elem.attribs.hasOwnProperty(attributesArray[i])) {
            return true;
          }
        }
      }
      return false;
    };
    return htmlparser.DomUtils.filter(checkAttrs, dom);
  }

  function extractStringsFromAttributes(dom, attributesArray) {
    var strings = [];
    var elements = filterElementsByAttributes(dom, attributesArray);
    for (var i = 0; i < elements.length; i++){
      for (var j = 0; j < attributesArray.length; j++){
        if (elements[i].attribs.hasOwnProperty(attributesArray[j])) {
          strings.push(elements[i].attribs[attributesArray[j]]);
        }
      }
    }
    return strings;
  }

  function hash(str, algorithm, length) {
    return crypto.createHash(algorithm).update(str).digest('hex').slice(0, length);
  }

  return through.obj(addFile, createLocaleFile);
};


gulpL10n.simulateTranslation = function(opt) {
  var options = opt = opt || {};
  //simulate localization to the following locales
  options.locales = opt.elements || ['de', 'es', 'fr'];
  options.dictionary = opt.dictionary || {
    'a': 'á',
    'e': 'é',
    'i': 'í',
    'o': 'ó',
    'u': 'ú'
  };
  var files = [];
  var regexs = {}
  //key is dictionary value, value is the search regex
  for(var entry in options.dictionary){
    //don't replace characters inside html tags (between `<` and `>`)
    regexs[options.dictionary[entry]] = new RegExp('(?![^<]*>)' + escapeRegExp(entry), 'g');
  }

  function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  function addFile(file, enc, cb){
    // ignore empty files
   if (file.isNull()) {
     cb();
     return;
   }
   if (file.isStream()) {
     cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not (yet) supported'));
     return;
   }
   if (file.isBuffer()) {
     files.push(file);
   }
    cb();
  }

  function createLocalizations(cb){
    if (files.length > 1) {
      cb(new gutil.PluginError(
        PLUGIN_NAME,
        'Please simulateTranslation() of one nativeLocale file at a time. Consider using gulp-foreach for more control.'
      ));
      return;
    }
    var translation = JSON.parse(files[0].contents);

    for(var hash in translation){
      for(var replacement in regexs){
        translation[hash] = translation[hash].replace(regexs[replacement], replacement);
      }
    }

    for(var i = 0; i < options.locales.length; i++){
      this.push(new gutil.File({
        cwd: "",
        base: "",
        path: options.locales[i] + '.json',
        contents: new Buffer(JSON.stringify(translation, null, '  '))
      }));
    }

    cb();
  }

  return through.obj(addFile, createLocalizations);
};

module.exports = gulpL10n;
