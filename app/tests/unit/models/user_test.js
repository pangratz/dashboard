require('dashboard/models/user');

module("Dashboard.User");

test("it exists", function() {
  ok(Dashboard.User, "it exists");
  ok(DS.Model.detect(Dashboard.User), "it is a DS.Model");
});