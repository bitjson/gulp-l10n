'use strict';

var through = require('through2');
var gutil = require('gulp-util');

var PLUGIN_NAME = 'gulp-s18n';

module.exports = function(opt) {

  function addFile(file, enc, cb) {
    // ignore empty files
    if (file.isNull()) {
      cb(null);
      return;
    }
    if (file.isStream()) {
      cb(new gutil.PluginError(PLUGIN_NAME, 'streaming not supported'));
      return;
    }
      // file is buffer
      cb(null);
      return;
  }

  function localizeFiles(cb) {
    cb();
    return;
  }

  return through.obj(addFile, localizeFiles);
};
