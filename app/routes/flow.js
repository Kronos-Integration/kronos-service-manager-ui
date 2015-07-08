import Ember from 'ember';
import fetch from 'fetch';

export default Ember.Route.extend({
  model: function (params) {
    return fetch(`flows/${params.flow_id}`).then((response) => {
      return response.json().then((data) => {

        const steps = [];

        let y = 0;

        for(let s in data.steps) {
          const step = data.steps[s];
          const endpoints = [];

          step.x = 0;
          step.y = y;
          y += 100;

          for(let e in step.endpoints) {
            const ep = step.endpoints[e];
            ep.isIn = ep.direction.match(/in/) ? true : false;
            ep.isOut = ep.direction.match(/out/) ? true : false;

            endpoints.push(ep);
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
