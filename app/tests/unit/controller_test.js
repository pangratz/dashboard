require('dashboard/controller');

var controller;

module("Dashboard.ApplicationController");

test("it exists", function() {
  ok(Dashboard.ApplicationController, "it exists");
});

module("Dashboard.UserController");

test("it exists", function() {
  ok(Dashboard.UserController, "it exists");
});

module("Dashboard.EventsController");

test("it exists", function() {
  ok(Dashboard.EventsController, "it exists");
});

module("Dashboard.RepositoriesController", {
  setup: function() {
    controller = Dashboard.RepositoriesController.create();
  },
  teardowm: function() {
    controller.destroy();
  }
});

test("it exists", function() {
  ok(Dashboard.RepositoriesController, "it exists");
});

test("loadWatchedRepositories invokes watchedRepositories on dataSource", function() {
  var watchedRepositoriesCalled, usernameParameter;
  var dataSource = {
    watchedRepositories: function(username) {
      watchedRepositoriesCalled = true;
      usernameParameter = username;
    }
  };

  Ember.run(function() { controller.set('dataSource', dataSource); });
  controller.loadWatchedRepositories('buster');

  ok(watchedRepositoriesCalled, "loadWatchedRepositories on dataSource has been called");
  equal(usernameParameter, 'buster', "supplied username has been passed to dataSource");
});