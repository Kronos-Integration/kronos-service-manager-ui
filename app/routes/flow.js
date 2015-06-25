import Ember from 'ember';
import fetch from 'fetch';

export default Ember.Route.extend({
  model: function (params) {
    return fetch(`flows/${params.flow_id}`).then((response) => {
      return response.json().then((data) => {

        const steps = [];

        for(let s in data.steps) {
          steps.push(data.steps[s]);
        }
        data.steps = steps;

        console.log(`response: ${JSON.stringify(data)}`);
        return data;
      });
    });
  }
});
