require('jquery');
require('handlebars');
require('ember');
require('ember-data');
require('ember-skeleton/ext');

Ember.ENV.CP_DEFAULT_CACHEABLE = true;
Ember.ENV.VIEW_PRESERVES_CONTEXT = true;

App = Ember.Application.create({
  VERSION: '0.1'
});
