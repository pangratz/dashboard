require('dashboard/core');
require('dashboard/github_data_source');

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
        // create the data source which connects to GitHub API
        var dataSource = Dashboard.GitHubDataSource.create();

        // initialize repositoriesController
        var repositoriesController = router.get('repositoriesController');
        repositoriesController.set('dataSource', dataSource);
        repositoriesController.set('content', []);
        repositoriesController.loadWatchedRepositories(context.username);

        // connect {{outlet}} with repositoriesController & RepositoriesView
        router.get('applicationController').connectOutlet('repositories');
      }
    })
  })
});
