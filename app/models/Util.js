//import Ember from 'ember';
import fetch from 'fetch';

import Step from './Step';
import Flow from './Flow';

const flowsArray = [];
const flowsById = {};

export function allFlows() {
  if (flowsArray.length > 0) {
    return flowsArray;
  }

  return fetch('flow').then(response => response.json().then(json => createFlowsFromJSON(
    json)));
}

export function getFlow(id) {
  const flow = flowsById[id];
  if (flow) {
    if (flow.steps) {
      return flow;
    }
  }

  return fetch(`flow/${id}`).then(response => response.json().then(json => createFromJSON(
    json)));
}

export function createFlow(json) {
  return fetch('flow', {
    method: 'POST',
    body: JSON.stringify(json)
  }).then((response) => response.json().then(json => console.log(`created: ${JSON.stringify(json)}`)));
}

export function deleteFlowLocally(id) {
  delete flowsById[id];
  const index = flowsArray.findIndex(flow => flow.id === id);
  if (index >= 0) {
    flowsArray.splice(index, 1);
  }
}

export function deleteFlow(id) {
  return fetch(`flow/${id}`, {
    method: 'DELETE'
  }).then(response => response.json().then(json => console.log(`deleted: ${JSON.stringify(json)}`)));
}

export function stopFlow(id) {
  return fetch(`flow/${id}/stop`, {
    method: 'POST'
  }).then(response => response.json().then(json => console.log(`stop: ${JSON.stringify(json)}`)));
}

export function startFlow(id) {
  return fetch(`flow/${id}/start`, {
    method: 'POST'
  }).then(response => response.json().then(json => console.log(`start: ${JSON.stringify(json)}`)));
}


export function createFlowsFromJSON(json) {

  json.forEach(e => {
    const flow = Flow.create({
      id: e,
      name: e,
      url: e
    });
    flowsArray.push(flow);
    flowsById[flow.id] = flow;
  });

  return flowsArray;
}

export function createFromJSON(data) {
  const steps = [];

  for (const s in data.steps) {
    const step = Step.create(data.steps[s]);
    steps.push(step);

    for (const e in step.endpoints) {
      const ep = step.endpoints[e];
      if (ep.target) {
        const m = ep.target.match(/^step:([^/]+)\/(.+)/);
        if (m) {
          const targetStep = m[1];
          const targetEndpoint = m[2];
          ep.counterpart = data.steps[targetStep].endpoints[targetEndpoint];
          ep.counterpart.counterpart = ep;
        }
      }
    }
  }

  let flow;

  if (flow = flowsById[data.id]) {

  } else {
    flow = Flow.create({
      id: data.name,
      name: data.name,
      url: data.name
    });
    flowsById[flow.id] = flow;
    flowsArray.push(flow);
  }

  flow.description = data.description;

  for (const s in data.steps) {
    const step = data.steps[s];
    const endpoints = [];

    for (const e in step.endpoints) {
      const ep = step.endpoints[e];

      ep.isIn = ep.direction.match(/in/) ? true : false;
      ep.isOut = ep.direction.match(/out/) ? true : false;

      endpoints.push(ep);
    }

    step.endpoints = endpoints;
    steps.push(step);
  }

  flow.steps = steps;

  return flow;
}
