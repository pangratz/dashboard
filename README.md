[GitHub Dashboard](http://pangratz.github.com/dashboard)
========================================================

GitHub Dashboard using Ember.js and Twitter Bootstrap. This repo is developed in the course of the accompanying blog posts at [code418.com](http://code418.com/blog/categories/github-dashboard/).

Running
-------

    $ bundle install
    $ bundle exec rackup

App Structure
-------------

    dashboard
    ├── Assetfile - App build file
    ├── Gemfile - Package dependencies for rakep/rack
    ├── Gemfile.lock - Here be dragons: don't touch, always include
    ├── app - App specific code
    │   ├── index.html - The app entry point
    │   ├── css - App CSS or SCSS (.scss)
    │   ├── lib - App code, *modularized during build*
    │   ├── modules - Module code, *already modularized*
    │   ├── plugins - Plugins (e.g. jquery.jsonrpc.js)
    │   │   └── loader.js - JS module loader
    │   ├── static - Static files, never touched, copied over during build
    │   ├── templates - Handlebars templates, *modularized during build*
    │   ├── tests - QUnit application tests
    │   └── vendor - Vendor code, *modularized during build*
    ├── assets - Built out asset files, minified in production
    │   ├── app.css - Built out app CSS/SCSS
    │   ├── app.js - Built out app JS
    │   └── loader.js - Built out JS module loader
    ├── config.ru - Rack development web server configuration
    ├── tests - QUnit testing files
    │   ├── index.html - The testing entry point
    │   ├── qunit - Testing support files
    │   └── run-tests.js - The PhantomJS QUnit test runner
    ├── test_assets - Built out test asset files
    │   ├── app-tests.js - App test files
    └── tmp - Temporary build files used by rakep

Testing
-------

You can test the app by invoking:

    $ bundle exec rake test

This executes the tests by using [PhantomJS](http://www.phantomjs.org/),
which you need to have installed.

Or you can run the tests via:

    $ bundle exec rackup
    $ open http://localhost:9292/tests/index.html

If you want to continuously run the tests every time a file changes, invoke:

    $ bundle exec guard
