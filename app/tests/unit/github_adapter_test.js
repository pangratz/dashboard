require('dashboard/github_adapter');

var get = Ember.get;

var ajaxCalled, ajaxParams;
var ajaxUrl, ajaxTarget, ajaxCallback;
var dataSource;

var setupDataSource = {
  setup: function() {
    dataSource = Dashboard.GitHubAdpater.create({
      ajax: function(url, target, callback) {
        ajaxCalled = true;
        ajaxParams = arguments;
        ajaxUrl = url;
        ajaxTarget = target;
        ajaxCallback = callback;
      }
    });
  },
  teardowm: function() {
    ajaxCallback = ajaxParams = null;
    ajaxUrl = ajaxTarget = ajaxCallback = null;
    dataSource.destroy();
  }
};

module("Dashboard.GitHubAdpater", setupDataSource);

test("is defined", function() {
  ok(Dashboard.GitHubAdpater, "is defined");
  ok(DS.Adapter.detect(Dashboard.GitHubAdpater), "it is a DS.Adapter");
});

test("_ajaxSuccess invokes callback on target", function() {
  var callbackCalled, callbackThis, callbackResponse;
  var response = {
    meta: {
      'X-RateLimit-Remaining': 42,
      'X-RateLimit-Limit': 100
    },
    data: {
      a: 1,
      b: 'hello'
    }
  };
  var target = {
    callback: function(response) {
      callbackCalled = true;
      callbackThis = this;
      callbackResponse = response;
    }
  };

  dataSource._ajaxSuccess(response, target, 'callback');

  equal(get(dataSource, 'remaining'), 42, "remaining has been read from repsonse.meta and set on the dataSource");
  equal(get(dataSource, 'limit'), 100, "limit has been read from repsonse.meta and set on the dataSource");

  ok(callbackCalled, 'callback has been called');
  deepEqual(callbackThis, target, "this inside called callback is set to target");
  deepEqual(callbackResponse, {a: 1, b: 'hello'}, "data of response is passed to callback");
});

test("_ajaxSuccess accepts function as target", function() {
  var callbackCalled, callbackResponse;
  var response = {
    meta: {
      'X-RateLimit-Remaining': 42,
      'X-RateLimit-Limit': 100
    },
    data: {
      a: 1,
      b: 'hello'
    }
  };
  var callback = function(response) {
    callbackCalled = true;
    callbackResponse = response;
  };

  dataSource._ajaxSuccess(response, callback);

  equal(get(dataSource, 'remaining'), 42, "remaining has been read from repsonse.meta and set on the dataSource");
  equal(get(dataSource, 'limit'), 100, "limit has been read from repsonse.meta and set on the dataSource");

  ok(callbackCalled, 'callback has been called');
  deepEqual(callbackResponse, {a: 1, b: 'hello'}, "data of response is passed to callback");  
});

module("Dashboard.GitHubAdpater#find for Dashboard.User", setupDataSource);

test("invokes ajax", function() {
  var store = {};
  dataSource.find(store, Dashboard.User, 'buster');

  ok(ajaxCalled, 'ajax has been called');
  deepEqual(ajaxUrl, '/users/buster', "the passed url is correct");
});

module("Dashboard.GitHubAdpater#watchedRepositories", setupDataSource);

test("invokes ajax", function() {
  var target = {};
  dataSource.watchedRepositories('buster', target, 'callback');

  ok(ajaxCalled, 'ajax has been called');
  deepEqual(ajaxUrl, '/users/buster/watched', "the passed url is correct");
  deepEqual(ajaxTarget, target, "the target has been passed");
  deepEqual(ajaxCallback, 'callback', "the callback has been passed");
});

module("Dashboard.GitHubAdpater#findQuery for Dashboard.Event", setupDataSource);

test("invokes ajax", function() {
  var target = {};
  dataSource.repositoryEvents('buster', 'bluth', target, 'callback');

  ok(ajaxCalled, 'ajax has been called');
  deepEqual(ajaxUrl, '/repos/buster/bluth/events', "the passed url is correct");
  deepEqual(ajaxTarget, target, "the target has been passed");
  deepEqual(ajaxCallback, 'callback', "the callback has been passed");
});