require('dashboard/store');
require('dashboard/model');
require('dashboard/github_adapter');

var store, adapter;

var callLater = function(func) {
  stop();
  var args = arguments;
  setTimeout(function() {
    args = Array.prototype.slice.call(args, 1);
    func.apply(this, args);
    start();
  }, 50);
};

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
    ajax: function(url, callback) {
      ok(true, "ajax has been called");
      equal(url, '/repos/pangratz/ember.js', 'correct url has been passed');

      callback({full_name: 'pangratz/ember.js'});
    }
  });

  var repo = store.find(Dashboard.Repository, 'pangratz/ember.js');
  ok(repo);
  equal(repo.get('id'), 'pangratz/ember.js', 'id is set immediately');
});

test("find works for getting a user", 4, function() {
  // it is expected that a find for Dashboard.User
  // invokes ajax
  adapter.reopen({
    ajax: function(url, callback) {
      ok(true, "ajax has been called");
      equal(url, '/users/pangratz', 'correct url has been passed');

      callback({login: 'pangratz'});
    }
  });

  var user = store.find(Dashboard.User, 'pangratz');
  ok(user, 'user is found');
  ok(user.get('id'), 'pangratz', 'id is set immediately');
});

test("findQuery works for watched repositories", 4, function() {
  // it is expected that a findQuery for Dashboard.Repository
  // invokes `watchedRepositories` on adapter when type in the query is 'watched'
  adapter.reopen({
    ajax: function(url, callback) {
      ok(true, "watched repositories has been called");
      equal(url, '/users/pangratz/watched', 'correct url has been passed');

      callLater(callback, [{full_name: 'first/repo'}, {full_name: 'second/repo'}]);
    }
  });

  var watchedRepos = store.findQuery(Dashboard.Repository, {
    username: 'pangratz',
    type: 'watched'
  });
  equal(watchedRepos.get('length'), 0, 'length is initially 0');

  watchedRepos.addArrayObserver(this, {
    didChange: function() {
      equal(watchedRepos.get('length'), 2);
    },
    willChange: Ember.K
  });
});

test("findQuery works for repositories", 4, function() {
  // it is expected that a findQuery for Dashboard.Repository
  // invokes `repositories` on adapter when there is just a username
  adapter.reopen({
    ajax: function(url, callback) {
      ok(true, "repositories has been called");
      equal(url, '/users/pangratz/repos', 'correct username has been passed');

      callLater(callback, [{full_name: 'pangratz/first'}, {full_name: 'pangratz/second'}]);
    }
  });

  var repos = store.findQuery(Dashboard.Repository, { username: 'pangratz' });
  equal(repos.get('length'), 0, 'length is initially 0');

  repos.addArrayObserver(this, {
    didChange: function(target, start, removed, added) {
      equal(repos.get('length'), 2, 'the array is populated');
    },
    willChange: Ember.K
  });
});