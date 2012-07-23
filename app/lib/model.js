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