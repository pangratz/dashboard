Dashboard.LoadMoreMixin = Ember.Mixin.create(Ember.Evented, {
  canLoadMore: true,
  autoFetch: true,
  currentPage: 1,
  resetLoadMore: function() {
    this.set('currentPage', 1);
  },
  loadMore: Ember.K
});