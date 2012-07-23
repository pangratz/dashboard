require('dashboard/core');
require('dashboard/github_adapter');

Dashboard.Store = DS.Store.extend({
  adapter: Dashboard.GitHubAdpater.create(),
  revision: 4
});