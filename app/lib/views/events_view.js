require('jquery.inview');

Dashboard.EventsView = Ember.View.extend({
  templateName: 'events',
  EventView: Ember.View.extend({
    templateName: 'events/githubEvent',

    timeAgoString: function() {
      var timeAgo = this.get('event.created_at');
      return moment(timeAgo).fromNow();
    }.property('timeAgo'),

    avatarUrl: function() {
        var gravatarId = this.get('event.actor.gravatar_id');
        return 'http://www.gravatar.com/avatar/%@'.fmt(gravatarId);
    }.property('event.actor.gravatar_id'),

    DetailView: Ember.View.extend({
      className: 'info'.w(),

      templateName: function() {
        var type = this.get('event.type');
        return 'events/%@-template'.fmt(type);
      }.property('event.type'),

      ActorView: Ember.View.extend({
        layoutName: 'events/actor',
        defaultTemplate: Ember.Handlebars.compile(''),
        tagName: '',
        eventBinding: 'parentView.event',

        href: function() {
          var login = this.get('event.actor.login');
          return 'https://github.com/%@'.fmt(login);
        }.property('event.actor.login')
      })
    })
  })
});
