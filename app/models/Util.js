import Ember from 'ember';
import fetch from 'fetch';
import Flow from './Flow';

const flowsById = {};
const servicesById = {};

export function allFlows() {
  if (flowsById.length > 0) {
    return flowsById;
  }

  return fetch('api/flow').then(response => response.json().then(flowJson => {
    return fetch('api/service').then(response => response.json().then(serviceJson => {
      serviceJson.forEach(s => {
        servicesById[s.name] = s;
      });

      return createFlowsFromJSON(flowJson);
    }));
  }));
}

export function getFlow(id) {
  const flow = flowsById[id];

  if (flow) {
    if (flow.state !== 'invalid') {
      return flow;
    }
  }

  return fetch(`api/flow/${id}`).then(response => response.json().then(json => createFromJSON(
    json)));
}

export function createFlow(json) {
  return fetch('api/flow', {
    method: 'PUT',
    body: JSON.stringify(json)
  }).then((response) => response.json().then(json => console.log(`created: ${JSON.stringify(json)}`)));
}

export function deleteFlowLocally(id) {
  delete flowsById[id];
}

export function deleteFlow(id) {
  return fetch(`api/flow/${id}`, {
    method: 'DELETE'
  }).then(() => {
    delete flowsById[id];
  });
}

export function stopFlow(id) {
  return fetch(`api/flow/${id}/stop`, {
    method: 'POST'
  }).then(response => response.json().then(json => console.log(`stop: ${JSON.stringify(json)}`)));
}

export function startFlow(id) {
  return fetch(`api/flow/${id}/start`, {
    method: 'POST'
  }).then(response => response.json().then(json => console.log(`start: ${JSON.stringify(json)}`)));
}


export function createFlowsFromJSON(json) {
  json.forEach(e => {
    const ObjectPromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);

    const flow = ObjectPromiseProxy.create({
      id: e,
      name: e,
      promise: fetch(`api/flow/${e}`)
    });

    flow.then(json => {
      const f = createFromJSON(json);
      flowsById[f.id] = f;
    });

    flowsById[flow.id] = flow;
  });

  return flowsById;
}

export function createFromJSON(data) {

  const flow = Flow.create({
    id: data.name,
    name: data.name,
    url: data.name
  });
  flowsById[flow.id] = flow;

  flow.description = data.description;
  flow.steps = data.steps;

  for (const s in data.steps) {
    const step = data.steps[s];

    step.leftSide = [];
    step.rightSide = [];

    for (const e in step.endpoints) {
      const endpoint = step.endpoints[e];

      endpoint.owner = flow;
      endpoint.name = e;

      if (endpoint.in) {
        endpoint.index = step.leftSide.length;
        step.leftSide.push({});
      }
      if (endpoint.out) {
        endpoint.index = step.rightSide.length;
        step.rightSide.push({});
      }

      if (endpoint.target) {
        let m = endpoint.target.match(/^([^\/]+)\/(.*)/);
        if (m) {
          const cs = flow.steps[m[1]];
          if (cs) {
            const ce = cs.endpoints[m[2]];
            if (ce) {
              const link = {
                src: endpoint,
                srcNode: step,
                dstNode: cs,
                dst: ce
              };
              //endpoint.link = link;
              flow.links.push(link);
            }
          }
        }

        m = endpoint.target.match(/^([^\/]+):(.*)/);
        if (m) {
          const cs = servicesById[m[1]];
          if (cs) {
            const ce = cs.endpoints[m[2]];
            if (ce) {
              const link = {
                src: endpoint,
                srcNode: step,
                dstNode: cs,
                dst: ce
              };
              flow.links.push(link);
            }
          }
        }
      }
    }
    step.name = s;
  }

  return flow;
}
