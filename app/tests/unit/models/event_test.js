require('dashboard/models/event');

module("Dashboard.Event");

test("it exists", function() {
  ok(Dashboard.Event, "it exists");
  ok(DS.Model.detect(Dashboard.Event), "it is a DS.Model");
});
