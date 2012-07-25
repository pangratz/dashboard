require('dashboard/github_adapter');

var get = Ember.get;

var ajaxCalled, ajaxParams;
var ajaxUrl, ajaxCallback;
var dataSource, store;

var setupDataSource = {
  setup: function() {
    dataSource = Dashboard.GitHubAdpater.create({
      _ajax: function(url, callback) {
        ajaxCalled = true;
        ajaxUrl = url;
        ajaxCallback = callback;
      }
    });
    store = DS.Store.create({
      adapter: dataSource,
      revision: 4
    });
  },
  teardowm: function() {
    ajaxCallback = ajaxParams = null;
    ajaxUrl = ajaxCallback = null;
    dataSource.destroy();
    store.destroy();
  }
};
var callAjaxCallback = function(response) {
  ajaxCallback.call(dataSource, response);
};

module("Dashboard.GitHubAdpater", setupDataSource);

test("is defined", function() {
  ok(Dashboard.GitHubAdpater, "is defined");
  ok(DS.Adapter.detect(Dashboard.GitHubAdpater), "it is a DS.Adapter");
});

test("ajax invokes _updateLimits", function() {
  var callbackCalled, callbackThis, callbackResponse;

  dataSource.ajax('/url', function(data) {
    callbackCalled = true;
    callbackThis = this;
    callbackResponse = data;
  });

  callAjaxCallback({
    meta: {
      'X-RateLimit-Remaining': 42,
      'X-RateLimit-Limit': 100
    },
    data: {
      a: 1,
      b: 'hello'
    }
  });

  equal(get(dataSource, 'remaining'), 42, "remaining has been read from repsonse.meta and set on the dataSource");
  equal(get(dataSource, 'limit'), 100, "limit has been read from repsonse.meta and set on the dataSource");

  ok(callbackCalled, 'callback has been called');
  deepEqual(callbackThis, dataSource, "this inside called callback is set to the adapter");
  deepEqual(callbackResponse, {a: 1, b: 'hello'}, "data of response is passed to callback");
});

module("Dashboard.GitHubAdpater#find for Dashboard.User calls ajax", setupDataSource);

test("invokes ajax", function() {
  store.find(Dashboard.User, 'buster');

  ok(ajaxCalled, 'ajax has been called');
  deepEqual(ajaxUrl, '/users/buster', "the passed url is correct");
});

module("Dashboard.GitHubAdpater#findQuery for a user's watched repositories", setupDataSource);

test("invokes ajax", function() {
  store.findQuery(Dashboard.Repository, { type: 'watched', username: 'buster' });

  ok(ajaxCalled, 'ajax has been called');
  deepEqual(ajaxUrl, '/users/buster/watched', "the passed url is correct");
});


module("Dashboard.GitHubAdpater#findQuery for a user's repositories calls ajax", setupDataSource);

test("invokes ajax", function() {
  store.findQuery(Dashboard.Repository, {username: 'buster'});

  ok(ajaxCalled, 'ajax has been called');
  deepEqual(ajaxUrl, '/users/buster/repos', "the passed url is correct");
});

module("Dashboard.GitHubAdpater#findQuery for events for a repository calls ajax", setupDataSource);

test("invokes ajax", function() {
  store.findQuery(Dashboard.Event, {username: 'buster', repository: 'bluth'});

  ok(ajaxCalled, 'ajax has been called');
  deepEqual(ajaxUrl, '/repos/buster/bluth/events', "the passed url is correct");
});

module("Dashboard.GitHubAdpater#findQuery for events for a user calls ajax", setupDataSource);

test("invokes ajax", function() {
  store.findQuery(Dashboard.Event, {username: 'buster'});

  ok(ajaxCalled, 'ajax has been called');
  deepEqual(ajaxUrl, '/users/buster/events', "the passed url is correct");
});