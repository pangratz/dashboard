require('dashboard/core');
require('dashboard/github_data_source');
require('dashboard/controller');

Dashboard.gitHubDataSource = Dashboard.GitHubDataSource.create();
Dashboard.set('repositoriesController', Dashboard.RepositoriesController.create({
  content: [],
  dataSourceBinding: 'Dashboard.gitHubDataSource'
}));
Dashboard.get('repositoriesController').loadWatchedRepositories('pangratz');

Ember.View.create({
  templateName: 'repositories',
  controllerBinding: 'Dashboard.repositoriesController'
}).append();