require('dashboard/store');
require('dashboard/model');
require('dashboard/github_data_source');

var store, adapter;

module("Dashboard.Store and Dashboard.GitHubDataSource integration tests", {
  setup: function() {
    adapter = Dashboard.GitHubDataSource.create();
    store = Dashboard.Store.create({ adapter: adapter });
  },
  teardown: function() {
    adapter.destroy();
    store.destroy();
  }
});

test("findQuery works for watched repositories", function() {
  // it is expected that a findQuery for Dashboard.Repository
  // invokes `watchedRepositories` on adapter when type in the query is 'watched'

  expect(2);

  adapter.reopen({
    watchedRepositories: function(username, target, callback) {
      ok(true, "watched repositories has been called");
      equal(username, 'pangratz', 'correct username has been passed');
    }
  });

  store.findQuery(Dashboard.Repository, {
    username: 'pangratz',
    type: 'watched'
  });
});
