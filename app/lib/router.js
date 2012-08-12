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

          router.get('eventsController').resetLoadMore();
          router.get('repositoriesController').resetLoadMore();

          // set current query
          var query = { username: username, isLoadedCallback: function() {
            router.set('eventsController.isLoading', false);
          }};
          router.set('eventsController.query', query);
          router.set('eventsController.isLoading', true);

          // get repositories for user
          var userRepositories = store.findQuery(Dashboard.Repository, { username: username });

          // get events performed by user
          var filter = function(data) {
            if (Ember.get(data, 'savedData.org.login') === username) { return true; }
            return Ember.get(data, 'savedData.actor.login') === username;
          };
          var userEvents = store.filter(Dashboard.Event, query, filter);

          // connect user with events and watched repositories
          router.get('applicationController').connectOutlet('user');
          router.get('userController').connectOutlet('repositories', 'repositories', userRepositories);
          router.get('userController').connectOutlet('events', 'events', userEvents);
        }
      }),

      repository: Ember.Route.extend({
        route: '/:repository',
        connectOutlets: function(router, context) {
          var username = router.get('userController.id');
          var repoName = context.repository;
          var name = '%@/%@'.fmt(username, repoName);

          router.get('eventsController').resetLoadMore();

          // set current query
          var query = {
            repoName: name,
            isLoadedCallback: function() {
              router.set('eventsController.isLoading', false);
            }
          };
          router.set('eventsController.query', query);
          router.set('eventsController.isLoading', true);

          // fetch repo for current user
          var repository = router.get('store').find(Dashboard.Repository, name);

          // get all events for this repository
          var filter = function(data) {
            return Ember.get(data, 'savedData.repo.name') === name;
          };
          var events = router.get('store').filter(Dashboard.Event, query, filter);

          // connect repository and events
          router.set('repositoryController.content', repository);
          router.get('applicationController').connectOutlet('repository');
          router.get('repositoryController').connectOutlet('events', 'events', events);
        }
      }),

      loadMoreEvents: function(router, page) {
        var query = router.get('eventsController.query');
        query.page = page;
        router.get('store').findQuery(Dashboard.Event, query);
        router.set('eventsController.isLoading', true);
      },
      loadMoreRepos: function(router, page) {
        var username = router.get('userController.id');
        var query = { username: username };
        var store = router.get('store').findQuery(Dashboard.Repository, query);
      },

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
