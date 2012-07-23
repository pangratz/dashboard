require('dashboard/core');

Dashboard.ApplicationController = Ember.Controller.extend();

Dashboard.UserController = Ember.Controller.extend();

Dashboard.RepositoryController = Ember.ObjectController.extend();

Dashboard.BreadCrumbsController = Ember.ArrayController.extend({
  init: function() {
    this.set('content', []);
    return this._super();
  },
  addHistoryItem: function(text) {
    this.pushObject({text: text});
  }
});

Dashboard.RepositoriesController = Ember.ArrayController.extend({
  sortProperties: 'full_name'.w(),
  loadWatchedRepositories: function(username) {
    this.get('dataSource').watchedRepositories(username, this, 'addObjects');
  }
});