import Ember from 'ember';
import fetch from 'fetch';

export default Ember.Route.extend({
  model: function (params) {
    return fetch(`flows/${params.flow_id}`).then((response) => {
      return response.json().then((data) => {
        console.log(`response: ${JSON.stringify(data)}`);
        return data;
      });
    });
  }
});
