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

module("{{trim}}");

test("trim is available", function() {
  ok(Ember.Handlebars.helpers.trim, "trim helper is available");
});

test("outputs by default given string", function() {
  var view = Ember.View.create({
    property: 'mystring',
    template: Ember.Handlebars.compile('{{trim property}}')
  });

  Ember.run(function() {
    view.appendTo('#qunit-fixture');
  });

  equal(Ember.$('#qunit-fixture').text(), 'mystring', "by default doesn't trim anything");
});

test("trims string to specific length", function() {
  var view = Ember.View.create({
    property: 'mystring',
    template: Ember.Handlebars.compile('{{trim property length=2}}')
  });
  
  Ember.run(function() {
    view.appendTo('#qunit-fixture');
  });
  
  equal(Ember.$('#qunit-fixture').text(), 'my', "it trims the string to given length");
});

test("exceeding length does not blow up the handler",
function() {
  var view = Ember.View.create({
    property: 'mystring',
    template: Ember.Handlebars.compile('{{trim property length=100}}')
  });
  
  Ember.run(function() {
    view.appendTo('#qunit-fixture');
  });
  
  equal(Ember.$('#qunit-fixture').text(), 'mystring', "it trims the string to given length");
});