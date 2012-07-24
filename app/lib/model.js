require('dashboard/core');

Dashboard.Repository = DS.Model.extend({
  name: DS.attr('string'),
  full_name: DS.attr('string'),
  description: DS.attr('string'),
  html_url: DS.attr('string'),
  homepage: DS.attr('string'),
  watchers: DS.attr('number'),
  forks: DS.attr('number'),
  language: DS.attr('string'),
  owner: function() {
    return this.get('data.owner')
  }.property('data')
});

Dashboard.Event = DS.Model.extend({
  type: DS.attr('string'),
  created_at: DS.attr('string'),
  actor: function() { return this.get('data.actor'); }.property('data.actor'),
  repo: function() { return this.get('data.repo'); }.property('data.repo'),
  org: function() { return this.get('data.org'); }.property('data.org'),
  payload: function() { return this.get('data.payload'); }.property('data.payload')
});