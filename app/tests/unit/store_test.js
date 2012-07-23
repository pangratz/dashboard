require('dashboard/store');

module("Dashboard.Store");

test("it exists", function() {
  ok(Dashboard.Store, "it exists");
  ok(DS.Store.detect(Dashboard.Store), "it is a DS.Store");
});