require('dashboard/core');

App.StartState = Ember.ViewState.extend({

  view: Ember.View.extend({
    templateName: 'dashboard/~templates/main_page'
  })

});
