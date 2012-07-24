require('dashboard/handlebars_helpers');

module("{{echo}}");

test("helper is available", function() {
    ok(Ember.Handlebars.helpers.echo, "echo helper is available");
});

test("returns the specified property", function() {
  var view = Ember.View.create({
    obj: Ember.Object.create({
        action: 'dingdong'
    }),
    template: Ember.Handlebars.compile('{{#with obj}}{{echo "action"}}{{/with}}')
  });
  
  Ember.run(function() {
    view.appendTo('#qunit-fixture');
  });
  
  equal(Ember.$('#qunit-fixture').text(), "dingdong", "echo helper outputs correct value");
});