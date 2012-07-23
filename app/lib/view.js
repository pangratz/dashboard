require('dashboard/core');

Dashboard.ApplicationView = Ember.View.extend({
  templateName: 'application'
});

Dashboard.RepositoryView = Ember.View.extend({
  templateName: 'repository'
});

Dashboard.RepositoriesView = Ember.View.extend({
  templateName: 'repositories'
});