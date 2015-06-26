import Ember from 'ember';
import fetch from 'fetch';

export default Ember.Route.extend({
  model: function (params) {
    return fetch(`flows/${params.flow_id}`).then((response) => {
      return response.json().then((data) => {

        const steps = [];

        for(let s in data.steps) {
          const step = data.steps[s];
          const endpoints = [];

          for(let e in step.endpoints) {
            endpoints.push(step.endpoints[e]);
          }
          step.endpoints = endpoints;
          steps.push(step);
        }
        data.steps = steps;

        //console.log(`response: ${JSON.stringify(data)}`);
        return data;
      });
    });
  }
});
