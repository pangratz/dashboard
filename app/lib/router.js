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
        router.transitionTo('user.index', Dashboard.User.find('pangratz'));
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

          // get watched repositories for given username
          var watchedRepositories = store.findQuery(Dashboard.Repository, {
            username: username,
            type: 'watched'
          });

          // set watched repositories on repositoriesController
          router.set('repositoriesController.content', watchedRepositories);

          // show repositories
          router.get('applicationController').connectOutlet('repositories');
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

      showUser: function(router, evt) {
        var username;
        var context = evt.context;

        // context is a Dashboard.RepositoryController if this action
        // is called from repository template --> this needs to be fixed
        if (Dashboard.RepositoryController.detectInstance(context)) {
          username = context.get('owner.login');
        } else {
          username = context;
        }

        router.transitionTo('user.index', Dashboard.User.find(username));
      },

      showRepository: function(router, evt) {
        // context is the full_name of a repository: username/repository
        var split = evt.context.split('/'),
            username = split[0],
            repository = split[1];

        router.transitionTo('user.repository', Dashboard.User.find(username), {repository: repository});
      }
    })
  })
});
