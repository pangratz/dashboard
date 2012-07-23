require('dashboard/model');

module("Dashboard.Repository");

test("it exists", function() {
  ok(Dashboard.Repository, "it exists");
  ok(DS.Model.detect(Dashboard.Repository), "it is a DS.Model");
});
