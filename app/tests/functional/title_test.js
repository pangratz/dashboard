casper.test.comment('Intial routing');

casper.start('http://localhost:9292', function() {
    this.test.assertTitle('GitHub Dashboard', 'title is the one expected');
    this.test.assertEquals(this.getCurrentUrl(), 'http://localhost:9292/#/pangratz', 'routes to default');
});

casper.run(function() {
    this.test.done();
});