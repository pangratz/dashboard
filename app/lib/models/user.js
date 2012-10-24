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