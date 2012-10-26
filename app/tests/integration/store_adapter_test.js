require('dashboard/store');
require('dashboard/models/main');
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

var origAjax;
var ajaxUrl, ajaxType, ajaxHash;

var expectUrl = function(url) {
  equal(ajaxUrl, 'https://api.github.com' + url, "url is expected");
};
var expectType = function(type) {
  equal(ajaxType, type, "the type is expected");
};
var expectAPICall = function(type, url) {
  expectType(type);
  expectUrl(url);
};
var expectState = function(m, state, value) {
  if (value === undefined) { value = true; }

  var flag = "is" + state.charAt(0).toUpperCase() + state.substr(1);
  equal(Ember.get(m, flag), value, "the model is " + (value === false ? "not " : "") + state);
};

module("Dashboard.Store and Dashboard.GitHubAdpater integration tests", {
  setup: function() {
    origAjax = jQuery.ajax;
    jQuery.ajax = function(hash) {
      ajaxUrl = hash.url;
      ajaxType = hash.type || 'GET';
      ajaxHash = {};
      ajaxHash.success = function(data) {
        hash.success.call(hash.context || this, {
          data: data
        });
      };
    };
    adapter = Dashboard.GitHubAdpater.create();
    store = Dashboard.Store.create({ adapter: adapter });
  },
  teardown: function() {
    adapter.destroy();
    store.destroy();
    jQuery.ajax = origAjax;
  }
});

test("find works for getting a repository", function() {
  var repository = store.find(Dashboard.Repository, 'pangratz/ember.js');
  expectState(repository, 'loaded', false);

  expectAPICall('GET', '/repos/pangratz/ember.js');
  ajaxHash.success({
    full_name: 'pangratz/ember.js'
  });

  expectState(repository, 'loaded');
  equal(repository.get('id'), 'pangratz/ember.js');
});

test("find works for getting an user", function() {
  var user = store.find(Dashboard.User, 'pangratz');
  expectState(user, 'loaded', false);

  expectAPICall('GET', '/users/pangratz');
  ajaxHash.success({
    login: 'pangratz'
  });

  expectState(user, 'loaded');
  equal(user.get('id'), 'pangratz');
});

test("findQuery works for watched repositories", function() {
  var watchedRepos = store.findQuery(Dashboard.Repository, {
    username: 'pangratz',
    type: 'watched'
  });
  expectState(watchedRepos, 'loaded', false);
  equal(watchedRepos.get('length'), 0);

  expectAPICall('GET', '/users/pangratz/watched');
  ajaxHash.success([{ full_name: 'first/repo' }, { full_name: 'second/repo' }]);

  expectState(watchedRepos, 'loaded');
  equal(watchedRepos.get('length'), 2);

  expectState(store.find(Dashboard.Repository, 'first/repo'), 'loaded');
  expectState(store.find(Dashboard.Repository, 'second/repo'), 'loaded');
});

test("findQuery works for repositories", function() {
  var repos = store.findQuery(Dashboard.Repository, {
    username: 'pangratz'
  });
  expectState(repos, 'loaded', false);
  equal(repos.get('length'), 0);

  expectAPICall('GET', '/users/pangratz/repos');
  ajaxHash.success([{ full_name: 'pangratz/first' }, { full_name: 'pangratz/second' }]);

  expectState(repos, 'loaded');
  equal(repos.get('length'), 2);

  expectState(store.find(Dashboard.Repository, 'pangratz/first'), 'loaded');
  expectState(store.find(Dashboard.Repository, 'pangratz/second'), 'loaded');
});
