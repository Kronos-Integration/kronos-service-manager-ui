//import Ember from 'ember';
import fetch from 'fetch';

import Step from 'kronos-service-manager-ui/models/Step';
//import Endpoint from 'kronos-service-manager-ui/models/Endpoint';
import Flow from 'kronos-service-manager-ui/models/Flow';

const flowsArray = [];
const flowsById = {};

export function allFlows() {
  if (flowsArray.length > 0) {
    return flowsArray;
  }

  return fetch('flows').then((response) => response.json().then((json) => createFlowsFromJSON(
    json)));
}

export function getFlow(id) {
  const flow = flowsById[id];
  if (flow) {
    if (flow.steps) {
      return flow;
    }
  }

  return fetch(`flows/${id}`).then((response) => response.json().then((json) => createFromJSON(
    json)));
}

export function createFlow(json) {
  return fetch('flows', {
    method: 'POST',
    body: JSON.stringify(json)
  }).then((response) => response.json().then(json => {
    console.log(`created: ${JSON.stringify(json)}`);
  }));
}

export function deleteFlowLocally(id) {
  delete flowsById[id];
  const index = flowsArray.findIndex( (flow) => flow.id === id);
  if(index >= 0) {
    //console.log(`splice: ${index}`);
    flowsArray.splice(index,1);
  }
}

export function deleteFlow(id) {
  return fetch(`flows/${id}`, {
    method: 'DELETE'
  }).then((response) => response.json().then(json => {
    console.log(`deleted: ${JSON.stringify(json)}`);
  }));
}

export function pauseFlow(id) {
  console.log(`pauseFlow: ${id}`);
}


export function createFlowsFromJSON(json) {
  //console.log(`createFlowsFromJSON: ${JSON.stringify(json)}`);

  json.forEach(e => {
    //console.log(`createFlowsFromJSON each: ${JSON.stringify(e)}`);
    const flow = Flow.create(e);
    flowsArray.push(flow);
    flowsById[flow.id] = flow;
  });

  return flowsArray;
}

export function createFromJSON(data) {
  console.log(`createFromJSON: ${JSON.stringify(data)}`);

  const steps = [];

  for (let s in data.steps) {
    const step = Step.create(data.steps[s]);
    steps.push(step);

    for (let e in step.endpoints) {
      const ep = step.endpoints[e];
      const m = ep.target.match(/^step:([^/]+)\/(.+)/);
      if (m) {
        const targetStep = m[1];
        const targetEndpoint = m[2];
        ep.counterpart = data.steps[targetStep].endpoints[targetEndpoint];
        ep.counterpart.counterpart = ep;
      }
    }
  }

  let flow;

  if (flow = flowsById[data.id]) {} else {
    flow = Flow.create({
      id: data.id,
      name: data.name
    });
    flowsById[flow.id] = flow;
    flowsArray.push(flow);
  }

  const originX = 10;
  const originY = 10;

  const stepW = 60;
  const stepH = 40;

  const stepOffset = 12;
  const endpointOffset = 12;

  let x = originX;
  let y = originY;

  for (let s in data.steps) {
    const step = data.steps[s];
    const endpoints = [];

    step.x = x;
    step.y = y;
    step.w = stepW;
    step.nx = x + stepW / 2;
    step.tx = x + stepW / 2;

    let nIn = 0,
      nOut = 0;

    for (let e in step.endpoints) {
      const ep = step.endpoints[e];

      ep.isIn = ep.direction.match(/in/) ? true : false;
      if (ep.isIn) {
        ep.x = x + endpointOffset;
        ep.y = y + endpointOffset + nIn++ * endpointOffset;
      }

      ep.isOut = ep.direction.match(/out/) ? true : false;
      if (ep.isOut) {
        ep.x = x + stepW - endpointOffset;
        ep.y = y + endpointOffset + nOut++ * endpointOffset;
      }

      endpoints.push(ep);
    }

    step.h = ((nIn > nOut ? nIn : nOut) + 1) * endpointOffset;
    step.ny = y + step.h / 2 + 5;
    step.ty = y + 10;

    step.endpoints = endpoints;
    steps.push(step);

    y += step.h + stepOffset;

    if (y > originY + 4 * stepH) {
      x += stepW + stepOffset;
      y = originY;
    }
  }

  flow.steps = steps;

  return flow;
}
