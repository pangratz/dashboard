var x = require('casper').selectXPath;

casper.test.comment('Clicking on a user when watching a specific repository changes route to user');

casper.start('http://localhost:9292/#/nokinen/fdc');

var nokinen = x('//a[text()="nokinen"]');
casper.waitUntilVisible(nokinen, function() {
    casper.click(nokinen);
});

casper.then(function() {
    this.test.assertEquals(this.getCurrentUrl(), 'http://localhost:9292/#/nokinen', 'routes to clicked repository');
});

casper.run(function() {
    this.test.done();
});