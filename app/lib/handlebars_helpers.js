require('dashboard/core');

// this helper is needed to print out properties which are called "action"
Ember.Handlebars.registerHelper('echo', function(propertyName, options) {
    return Ember.get(options.contexts[0], propertyName);
});