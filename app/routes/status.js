import Ember from 'ember';
import fetch from 'fetch';

export default Ember.Route.extend({
  model: function () {
    return fetch('status').then((response) => {
      return response.json();
      });
    });
  }
});
