require('dashboard/core');
require('dashboard/model');

Dashboard.Router = Ember.Router.extend({
  root: Ember.Route.extend({

    gotoIndex: function(router) {
      // FIXME: somehow router.transitionTo('root.index') doesn't work
      router.route('/');
    },

    index: Ember.Route.extend({
      route: '/',
      connectOutlets: function(router) {
        router.route('/pangratz');
      }
    }),

    user: Ember.Route.extend({
      route: '/:user_id',
      connectOutlets: function(router, user) {
        router.set('userController.content', user);
      },

      index: Ember.Route.extend({
        route: '/',
        connectOutlets: function(router) {
          var username = router.get('userController.id');
          var store = router.get('store');

          // get repositories for user
          var repos = store.findQuery(Dashboard.Repository, { username: username });
          router.set('repositoriesController.content', repos);

          // get events performed by user
          var userEvents = store.findQuery(Dashboard.Event, { username: username });
          router.set('eventsController.content', userEvents);

          // connect user with events and watched repositories
          router.get('applicationController').connectOutlet('user');
          router.get('userController').connectOutlet('repositories', 'repositories');
          router.get('userController').connectOutlet('events', 'events');
        }
      }),

      repository: Ember.Route.extend({
        route: '/:repository',
        connectOutlets: function(router, context) {
          var username = router.get('userController.id');
          var repoName = context.repository;

          // fetch repo for current user
          var repo = router.get('store').find(Dashboard.Repository, '%@/%@'.fmt(username, repoName));
          router.set('repositoryController.content', repo);

          var events = router.get('store').findQuery(Dashboard.Event, {
            username: username,
            repository: repoName
          });

          // connect repository and events
          router.get('applicationController').connectOutlet('repository');
          router.get('repositoryController').connectOutlet('events', 'events', events);
        }
      }),

      showUserOfEvent: function(router, evt) {
        var e = evt.context;
        var username = e.get('actor.login');
        router.route('/%@'.fmt(username));
      },
      showUserOfRepository: function(router, evt) {
        var repository = evt.context;
        var username = repository.get('owner.login');
        router.route('/%@'.fmt(username));
      },

      showRepository: function(router, evt) {
        var repository = evt.context;
        var full_name = repository.get('full_name');
        router.route('/%@'.fmt(full_name));
      },
      showRepositoryOfEvent: function(router, evt) {
        var e = evt.context;
        var full_name = e.get('repo.name');
        router.route('/%@'.fmt(full_name));
      }
    })
  })
});
