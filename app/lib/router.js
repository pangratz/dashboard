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
        router.set('userController.username', context.username);
      },

      index: Ember.Route.extend({
        route: '/',
        connectOutlets: function(router) {
          var username = router.get('userController.username');
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

          // fetch repo for current user
          var repo = router.get('store').find(Dashboard.Repository, '%@/%@'.fmt(username, repoName));
          router.set('repositoryController.content', repo);

          // show repository
          router.get('applicationController').connectOutlet('repository');
        }
      })
    })
  })
});
