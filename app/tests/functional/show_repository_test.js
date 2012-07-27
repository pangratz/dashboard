var x = require('casper').selectXPath;

casper.test.comment('Clicking on a repository shows repository page');

casper.start('http://localhost:9292/#/pangratz');

// change this to check for availability of repository which shall be shown
var dashboard = x('//a[text()="dashboard"]');
casper.waitUntilVisible(dashboard, function() {
    casper.click(dashboard);
});

casper.then(function() {
    this.test.assertEquals(this.getCurrentUrl(), 'http://localhost:9292/#/pangratz/dashboard', 'routes to clicked repository');
});

casper.run(function() {
    this.test.done();
});