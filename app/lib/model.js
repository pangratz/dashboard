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
  updated_at: DS.attr('date'),
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

Dashboard.User = DS.Model.extend({
  primaryKey: 'login',
  login: DS.attr('string'),
  avatar_url: DS.attr('string'),
  name: DS.attr('string'),
  blog: DS.attr('string'),
  email: DS.attr('string'),
  bio: DS.attr('string'),
  public_repos: DS.attr('number'),
  followers: DS.attr('number'),
  following: DS.attr('number'),
  html_url: DS.attr('string'),
  created_at: DS.attr('string')
});