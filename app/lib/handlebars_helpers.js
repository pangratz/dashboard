require('dashboard/core');

var getPath = Ember.Handlebars.getPath, normalizePath = Ember.Handlebars.normalizePath;

var getValue = function(property, options, context) {
  var context = (options.contexts && options.contexts[0]) || context,
      normalized = normalizePath(context, property, options.data),
      pathRoot = normalized.root,
      path = normalized.path,
      value = (path === 'this') ? pathRoot : getPath(pathRoot, path, options);

  return value;
};

// this helper is needed to print out properties which are called "action"
Ember.Handlebars.registerHelper('echo', function(property, options) {
  return getValue(property, options, this);
});

// trim a given property to specific length
Ember.Handlebars.registerHelper('trim', function(property, options) {
  var length = options.hash.length;
  var string = getValue(property, options, this);
  if (string && length) {
    string = string.substring(0, length);
  }
  return new Handlebars.SafeString(string || '');
});

// output timestamp property as something like `1h ago`
Ember.Handlebars.registerHelper('ago', function(property, options) {
  var timestamp = getValue(property, options, this);
  if (options.hash.isSeconds) {
    // the given property represents seconds since UNIX epoch, so we multiply
    // by 1000 to get the date in milliseconds since UNIX epoch
    timestamp *= 1000;
  }

  return moment(new Date(timestamp)).fromNow();
});