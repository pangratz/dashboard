require('dashboard/core');
require('dashboard/github_data_source');

Dashboard.Store = DS.Store.extend({
  adapter: Dashboard.GitHubDataSource.create(),
  revision: 4
});