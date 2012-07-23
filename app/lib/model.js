require('dashboard/core');

Dashboard.Repository = DS.Model.extend({
  full_name: DS.attr('string'),
  description: DS.attr('string'),
  html_url: DS.attr('string')
});