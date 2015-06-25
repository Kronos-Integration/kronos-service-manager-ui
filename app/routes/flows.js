import Ember from 'ember';
import fetch from 'fetch';

export default Ember.Route.extend({
  model: function () {
    return fetch('flows').then((response) => {
      return response.json().then((data) => {
        return data.map((f) => {
          return {
            id: f.id,
            name: f.name,
            description: f.description
          };
        });
      });
    });
  }
});
