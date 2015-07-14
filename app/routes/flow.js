import Ember from 'ember';
import fetch from 'fetch';

export default Ember.Route.extend({
  model: function (params) {
    return fetch(`flows/${params.flow_id}`).then((response) => {
      return response.json().then((data) => {

        for(let s in data.steps) {
          const step = data.steps[s];
          for(let e in step.endpoints) {
            const ep = step.endpoints[e];
            const m = ep.target.match(/^step:([^/]+)\/(.+)/);
            if(m) {
              const targetStep = m[1];
              const targetEndpoint = m[2];
              ep.counterpart = data.steps[targetStep].endpoints[targetEndpoint];
            }
          }
        }

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

            ep.x = x + (ep.isOut ? 70 : 10);
            ep.y = y + 20 + n * 15;
            n++;
            endpoints.push(ep);
          }
          step.endpoints = endpoints;
          steps.push(step);

          y += 60;

          if(y > 250) {
            x += 150;
            y = 150;
          }
        }
        data.steps = steps;

        return data;
      });
    });
  }
});
