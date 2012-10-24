require('jquery');
require('handlebars');
require('ember');
require('ember-data');
require('moment');
require('dashboard/ext');

Dashboard = Ember.Application.create({
  autoinit: false,
  VERSION: '0.0.0'
});
