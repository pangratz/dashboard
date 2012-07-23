require('dashboard/core');
require('dashboard/model');

Dashboard.Router = Ember.Router.extend({
  root: Ember.Route.extend({
    index: Ember.Route.extend({
      route: '/',
      connectOutlets: function(router) {
        router.transitionTo('user', {
          username: 'pangratz'
        });
      }
    }),
    user: Ember.Route.extend({
      route: '/:username',
      connectOutlets: function(router, context) {
        var store = router.get('store');

        // get watched repositories for given username
        var watchedRepositories = store.findQuery(Dashboard.Repository, {
          username: context.username,
          type: 'watched'
        });

        // set watched repositories on repositoriesController
        var repositoriesController = router.get('repositoriesController');
        repositoriesController.set('content', watchedRepositories);

        // connect {{outlet}} with repositoriesController & RepositoriesView
        router.get('applicationController').connectOutlet('repositories');
      }
    })
  })
});
