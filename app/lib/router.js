require('dashboard/core');
require('dashboard/model');

Dashboard.Router = Ember.Router.extend({
  root: Ember.Route.extend({
    index: Ember.Route.extend({
      route: '/',
      connectOutlets: function(router) {
        router.transitionTo('user.index', {
          username: 'pangratz'
        });
      }
    }),

    user: Ember.Route.extend({
      route: '/:username',
      connectOutlets: function(router, context) {
        router.get('applicationController').connectOutlet('breadCrumbs', 'breadCrumbs');
        router.set('userController.username', context.username);
      },

      index: Ember.Route.extend({
        route: '/',
        connectOutlets: function(router) {
          var username = router.get('userController.username');
          router.get('breadCrumbsController').addHistoryItem(username);

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
          var username = router.get('userController.username');
          var repoName = context.repository;
          router.get('breadCrumbsController').addHistoryItem(username + '/' + repoName);

          // fetch repo for current user
          var repo = router.get('store').find(Dashboard.Repository, '%@/%@'.fmt(username, repoName));
          router.set('repositoryController.content', repo);

          // show repository
          router.get('applicationController').connectOutlet('repository');
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

        router.transitionTo('user.index', {
          username: username
        });
      },

      showRepository: function(router, evt) {
        // context is the full_name of a repository: username/repository
        var split = evt.context.split('/'),
            username = split[0],
            repository = split[1];

        router.transitionTo('user.repository', {username: username}, {repository: repository});
      }
    })
  })
});
