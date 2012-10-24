require('dashboard/core');
require('dashboard/models/main');
require('dashboard/controllers/main');
require('dashboard/handlebars_helpers');
require('dashboard/views/main');
require('dashboard/store');
require('dashboard/router');

Dashboard.initialize();

// temporary fix until Ember-Data is updated and store injection is available
if (!Dashboard.get('router.store')) {
  Dashboard.set('router.store', Dashboard.Store.create());
}