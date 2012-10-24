Dashboard.Event = DS.Model.extend({
  type: DS.attr('string'),
  created_at: DS.attr('string'),
  actor: function() { return this.get('data.actor'); }.property('data.actor'),
  repo: function() { return this.get('data.repo'); }.property('data.repo'),
  org: function() { return this.get('data.org'); }.property('data.org'),
  payload: function() { return this.get('data.payload'); }.property('data.payload')
});
