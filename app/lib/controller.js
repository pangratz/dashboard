require('dashboard/core');

Dashboard.LoadMoreMixin = Ember.Mixin.create(Ember.Evented, {
  canLoadMore: true,
  autoFetch: true,
  currentPage: 1,
  resetLoadMore: function() {
    this.set('currentPage', 1);
  },
  loadMore: Ember.K
});

Dashboard.ApplicationController = Ember.Controller.extend();

Dashboard.UserController = Ember.ObjectController.extend();

Dashboard.RepositoryController = Ember.ObjectController.extend();

Dashboard.EventsController = Ember.ArrayController.extend(Dashboard.LoadMoreMixin, {
  canLoadMore: function() {
    // github only allows 10 pages for events, see http://developer.github.com/v3/events/
    return this.get('currentPage') < 10;
  }.property('currentPage'),

  loadMore: function() {
    if (this.get('canLoadMore')) {
      var page = this.incrementProperty('currentPage');
      this.get('target').send('loadMoreEvents', page);
    }
  }
});

Dashboard.RepositoriesController = Ember.ArrayController.extend(Dashboard.LoadMoreMixin, {
  sortProperties: 'updated_at'.w(),
  sortAscending: false,
  loadWatchedRepositories: function(username) {
    this.get('dataSource').watchedRepositories(username, this, 'addObjects');
  },

  canLoadMore: function() {
    var reposCount = this.get('owner.publicRepos');
    var length = this.get('length');
    return true || (length < reposCount);
  }.property('owner.publicRepos', 'length'),

  loadMore: function() {
    if (this.get('canLoadMore')) {
      var page = this.incrementProperty('currentPage');
      this.get('target').send('loadMoreRepos', page);
    }
  }
});