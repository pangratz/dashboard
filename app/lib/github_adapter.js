require('dashboard/core');
require('dashboard/models/main');

Dashboard.GitHubAdpater = DS.Adapter.extend({
  PREFIX: 'https://api.github.com',

  _ajax: function(url, callback) {
    Ember.$.ajax({
      url: this.PREFIX + url,
      dataType: 'jsonp',
      context: this,
      success: callback
    });
  },

  ajax: function(url, callback) {
    this._ajax(url,
    function(response) {
      this._updateLimits(response);
      callback.call(this, response.data);
    });
  },

  _updateLimits: function(response) {
    if (response.meta) {
      this.set('remaining', response.meta['X-RateLimit-Remaining']);
      this.set('limit', response.meta['X-RateLimit-Limit']);
    }
  },

  _invoke: function(target, callback, query) {
    return function(data) {
      Ember.tryInvoke(target, callback, [data]);
      Ember.tryInvoke(query, 'isLoadedCallback');
    };
  },

  _storeLoad: function(store, type, id) {
    return function(data) {
      store.load(type, id, data);
    };
  },

  find: function(store, type, id) {
    if (Dashboard.Repository.detect(type)) {
      this.ajax('/repos/%@'.fmt(id), this._storeLoad(store, type, id));
    } else if (Dashboard.User.detect(type)) {
      this.ajax('/users/%@'.fmt(id), this._storeLoad(store, type, id));
    }
  },

  findQuery: function(store, type, query, modelArray) {
    // watched repositories for a user
    if (Dashboard.Repository.detect(type) && query.username && 'watched' === query.type) {
      this.ajax('/users/%@/watched'.fmt(query.username), this._invoke(modelArray, 'load'));

    // repositories for a user
    } else if (Dashboard.Repository.detect(type) && query.username) {
      this.ajax('/users/%@/repos'.fmt(query.username), this._invoke(modelArray, 'load'));

    // events for a repository
    } else if (Dashboard.Event.detect(type) && query.repository && query.username) {
      this.ajax('/repos/%@/%@/events?page=%@'.fmt(query.username, query.repository, query.page || 1), this._invoke(modelArray, 'load', query));

    // events for a user
    } else if (Dashboard.Event.detect(type) && query.username) {
      this.ajax('/users/%@/events?page=%@'.fmt(query.username, query.page || 1), this._invoke(modelArray, 'load', query));
    }
  }
});

Dashboard.GitHubFixtureAdpater = Dashboard.GitHubAdpater.extend({
  PREFIX: 'http://localhost:9292/app/tests/mock_response_data',
  _ajax: function(url, callback) {
    var encodedUrl = url.replace(/\?/, '%3F').replace(/\=/, '%3D');
    Ember.run.later(this, function() {
      Ember.$.ajax({
        url: this.PREFIX + encodedUrl + '.json',
        context: this,
        success: function(data) {
         callback.call(this, {meta: {}, data: data});
        }
      });
    }, 500);
  }
});