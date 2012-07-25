require('dashboard/core');

Dashboard.ApplicationController = Ember.Controller.extend();

Dashboard.UserController = Ember.ObjectController.extend();

Dashboard.RepositoryController = Ember.ObjectController.extend();

Dashboard.EventsController = Ember.ArrayController.extend();

Dashboard.RepositoriesController = Ember.ArrayController.extend({
  sortProperties: 'updated_at'.w(),
  sortAscending: false,
  loadWatchedRepositories: function(username) {
    this.get('dataSource').watchedRepositories(username, this, 'addObjects');
  }
});