require('dashboard/core');

Dashboard.RepositoriesController = Ember.ArrayController.extend({
  sortProperties: 'full_name'.w(),
  loadWatchedRepositories: function(username) {
    this.get('dataSource').watchedRepositories(username, this, 'addObjects');
  }
});