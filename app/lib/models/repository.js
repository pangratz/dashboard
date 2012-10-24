Dashboard.Repository = DS.Model.extend({
  primaryKey: 'full_name',
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
    return this.get('data.owner');
  }.property('data')
});