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

test("find works for getting a repository", 4, function() {
  // it is expected that a find for Dashboard.Repository
  // invokes ajax
  adapter.reopen({
    ajax: function(url, target, callback) {
      ok(true, "ajax has been called");
      equal(url, '/repos/pangratz/ember.js', 'correct url has been passed');

      this._ajaxSuccess({meta: {}, data: {full_name: 'pangratz/ember.js'}}, target, callback);
    }
  });

  var repo = store.find(Dashboard.Repository, 'pangratz/ember.js');
  ok(repo);
  equal(repo.get('full_name'), 'pangratz/ember.js');
});

test("find works for getting a user", 4, function() {
  // it is expected that a find for Dashboard.User
  // invokes ajax
  adapter.reopen({
    ajax: function(url, target, callback) {
      ok(true, "ajax has been called");
      equal(url, '/users/pangratz', 'correct url has been passed');

      this._ajaxSuccess({meta: {}, data: {login: 'pangratz'}}, target, callback);
    }
  });

  var user = store.find(Dashboard.User, 'pangratz');
  ok(user, 'user is found');
  ok(user.get('login'), 'pangratz');
});

test("findQuery works for watched repositories", 4, function() {
  // it is expected that a findQuery for Dashboard.Repository
  // invokes `watchedRepositories` on adapter when type in the query is 'watched'
  adapter.reopen({
    watchedRepositories: function(username, target, callback) {
      ok(true, "watched repositories has been called");
      equal(username, 'pangratz', 'correct username has been passed');

      this._ajaxSuccess({meta: {}, data: [{full_name: 'first/repo'}, {full_name: 'second/repo'}]}, target, callback);
    }
  });

  var watchedRepos = store.findQuery(Dashboard.Repository, {
    username: 'pangratz',
    type: 'watched'
  });
  ok(watchedRepos, 'query is returned');
  equal(watchedRepos.get('length'), 2);
});

test("findQuery works for repositories", 4, function() {
  // it is expected that a findQuery for Dashboard.Repository
  // invokes `repositories` on adapter when there is just a username
  adapter.reopen({
    repositories: function(username, target, callback) {
      ok(true, "repositories has been called");
      equal(username, 'pangratz', 'correct username has been passed');

      this._ajaxSuccess({meta: {}, data: [{full_name: 'pangratz/first'}, {full_name: 'pangratz/second'}]}, target, callback);
    }
  });

  var repos = store.findQuery(Dashboard.Repository, { username: 'pangratz' });
  ok(repos);
  ok(repos.get('length'), 2);
});