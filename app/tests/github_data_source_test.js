require('dashboard/github_data_source');

var get = Ember.get;

var dataSource;
var setupDataSource = {
  setup: function() {
    dataSource = Dashboard.GitHubDataSource.create();
  },
  teardowm: function() {
    dataSource.destroy();
  }
};


module("Dashboard.GitHubDataSource", setupDataSource);

test("is defined", function() {
  ok(Dashboard.GitHubDataSource, "is defined");
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

  dataSource._ajaxSuccess(target, 'callback', response);

  equal(get(dataSource, 'remaining'), 42, "remaining has been read from repsonse.meta and set on the dataSource");
  equal(get(dataSource, 'limit'), 100, "limit has been read from repsonse.meta and set on the dataSource");

  ok(callbackCalled, 'callback has been called');
  deepEqual(callbackThis, target, "this inside called callback is set to target");
  deepEqual(callbackResponse, {a: 1, b: 'hello'}, "data of response is passed to callback");
});


module("Dashboard.GitHubDataSource#watchedRepositories", setupDataSource);

test("invokes ajax", function() {
  var ajaxCalled, ajaxParams;
  var ajaxUrl, ajaxTarget, ajaxCallback;
  dataSource.reopen({
    ajax: function(url, target, callback) {
      ajaxCalled = true;
      ajaxParams = arguments;
      ajaxUrl = url;
      ajaxTarget = target;
      ajaxCallback = callback;
    }
  });
  var target = {};

  dataSource.watchedRepositories('buster', target, 'callback');

  ok(ajaxCalled, 'ajax has been called');
  deepEqual(ajaxUrl, '/users/buster/watched', "the passed url is correct");
  deepEqual(ajaxTarget, target, "the target has been passed");
  deepEqual(ajaxCallback, 'callback', "the callback has been passed");
});
