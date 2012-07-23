require('dashboard/store');
require('dashboard/model');
require('dashboard/github_adapter');

var store, adapter;

module("Dashboard.Store and Dashboard.GitHubAdpater integration tests", {
  setup: function() {
    adapter = Dashboard.GitHubAdpater.create();
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
