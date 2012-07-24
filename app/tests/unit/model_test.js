require('dashboard/model');

module("Dashboard.Repository");

test("it exists", function() {
  ok(Dashboard.Repository, "it exists");
  ok(DS.Model.detect(Dashboard.Repository), "it is a DS.Model");
});

module("Dashboard.Event");

test("it exists", function() {
  ok(Dashboard.Event, "it exists");
  ok(DS.Model.detect(Dashboard.Event), "it is a DS.Model");
});

module("Dashboard.User");

test("it exists", function() {
  ok(Dashboard.User, "it exists");
  ok(DS.Model.detect(Dashboard.User), "it is a DS.Model");
});