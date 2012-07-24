require('dashboard/core');

Dashboard.ApplicationController = Ember.Controller.extend();

Dashboard.UserController = Ember.ObjectController.extend();

Dashboard.RepositoryController = Ember.ObjectController.extend();

Dashboard.EventsController = Ember.ArrayController.extend();

Dashboard.RepositoriesController = Ember.ArrayController.extend({
  sortProperties: 'full_name'.w(),
  loadWatchedRepositories: function(username) {
    this.get('dataSource').watchedRepositories(username, this, 'addObjects');
  }
});