import Ember from 'ember';
import fetch from 'fetch';

export default Ember.Route.extend({
  model: function (params) {
    return fetch(`flows/${params.flow_id}`).then((response) => {
      return response.json().then((data) => {

        const steps = [];

        let y = 150;
        let x = 150;

        for(let s in data.steps) {
          const step = data.steps[s];
          const endpoints = [];

          step.x = x;
          step.y = y;
          step.w = 80;
          step.h = 50;
          step.tx = x + 30;
          step.ty = y + 30;

          let n = 0;
          for(let e in step.endpoints) {
            const ep = step.endpoints[e];
            ep.isIn = ep.direction.match(/in/) ? true : false;
            ep.isOut = ep.direction.match(/out/) ? true : false;

            ep.x = x + 10;
            ep.y = y + 20 + n * 15;
            n++;
            endpoints.push(ep);
          }
          step.endpoints = endpoints;
          steps.push(step);

          y += 60;
        }
        data.steps = steps;

        //console.log(`response: ${JSON.stringify(data)}`);
        return data;
      });
    });
  }
});
