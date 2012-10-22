require('dashboard/controllers/repositories_controller');

var controller;

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