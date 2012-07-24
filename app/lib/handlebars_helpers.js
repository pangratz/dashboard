require('dashboard/core');

// this helper is needed to print out properties which are called "action"
Ember.Handlebars.registerHelper('echo', function(propertyName, options) {
    return Ember.get(options.contexts[0], propertyName);
});

// trim a given property to specific length
Ember.Handlebars.registerHelper('trim', function(path, options) {
    var length = options.hash.length;
    var string = Ember.get(options.contexts[0], path);
    if (string && length) {
        string = string.substring(0, length);
    }
    return new Handlebars.SafeString(string || '');
});