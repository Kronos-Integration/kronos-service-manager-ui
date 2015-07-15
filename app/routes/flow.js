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

        const originX = 10;
        const originY = 10;

        const stepW = 60;
        const stepH = 40;

        const stepOffset = 12;
        const endpointOffset = 12;

        let x = originX;
        let y = originY;

        for(let s in data.steps) {
          const step = data.steps[s];
          const endpoints = [];

          step.x = x;
          step.y = y;
          step.w = stepW;
          step.tx = x + endpointOffset * 2;
          step.ty = y + endpointOffset * 2;

          let nIn = 0, nOut = 0;

          for(let e in step.endpoints) {
            const ep = step.endpoints[e];

            ep.isIn = ep.direction.match(/in/) ? true : false;
            if(ep.isIn) {
              ep.x = x + endpointOffset;
              ep.y = y + endpointOffset + nIn * endpointOffset;
              nIn++;
            }

            ep.isOut = ep.direction.match(/out/) ? true : false;
            if(ep.isOut) {
              ep.x = x + stepW - endpointOffset;
              ep.y = y + endpointOffset + nOut * endpointOffset;
              nOut++;
            }

            endpoints.push(ep);
          }

          step.h = ((nIn > nOut ? nIn : nOut) + 1) * endpointOffset;

          step.endpoints = endpoints;
          steps.push(step);

          y += step.h + stepOffset;

          if(y > originY + 4 * stepH) {
            x += stepW + stepOffset;
            y = originY;
          }
        }
        data.steps = steps;

        return data;
      });
    });
  }
});
