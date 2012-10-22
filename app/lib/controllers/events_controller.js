require('dashboard/mixins/load_more');

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
