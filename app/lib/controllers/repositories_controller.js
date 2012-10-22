require('dashboard/mixins/load_more');

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