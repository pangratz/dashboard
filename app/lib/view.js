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

Dashboard.BreadCrumbsView = Ember.View.extend({
  templateName: 'breadcrumbs',
  lastItemBinding: 'controller.lastObject',
  BreadCrumbView: Ember.View.extend({
    tagName: 'li',
    isLast: function() {
      return this.get('parentView.lastItem') === this.get('item');
    }.property('item', 'parentView.lastItem')
  })
});