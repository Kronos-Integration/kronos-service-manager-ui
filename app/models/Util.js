/*  Promise */

import Ember from 'ember';
import fetch from 'fetch';
import Flow from './Flow';
import Service from './Service';
import Node from './Node';
import SendEndpoint from './SendEndpoint';
import ReceiveEndpoint from './ReceiveEndpoint';

const nodesById = {};
const flowsById = {};
const servicesById = {};

export function allNodes() {
  if (nodesById.length > 0) {
    return Promise.resolve(nodesById);
  }

  return fetch('api/nodes').then(response => response.json()).then(nodeJson => {
    nodeJson.forEach(s => {
      const node = new Node(s.Node, s.Address, s.ServiceTags);
      nodesById[node.id] = node;
    });

    return nodesById;
  });
}

export function getNode(id) {
  return allNodes().then(all => all[id]);
}

export function allServices() {
  if (servicesById.length > 0) {
    return Promise.resolve(servicesById);
  }

  return fetch('api/service').then(response => response.json()).then(serviceJson => {
    serviceJson.forEach(s => {
      const service = new Service({
        name: s.name,
        state: s.state,
        description: s.description
      });

      Object.keys(s.endpoints).forEach(en => {
        const e = s.endpoints[en];
        const ep = e.in ? new ReceiveEndpoint(en, service) : new SendEndpoint(en, service);
        service.endpoints[ep.name] = ep;
      });

      servicesById[service.id] = service;
    });

    return servicesById;
  });
}

export function getService(id) {
  return allServices().then(all => all[id]);
}

export function allFlows() {
  if (flowsById.length > 0) {
    return flowsById;
  }

  return fetch('api/flow').then(response => response.json().then(flowJson =>
    createFlowsFromJSON(flowJson)
  ));
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
  const flow = new Flow({
    name: data.name,
    description: data.description
  });

  flowsById[flow.id] = flow;

  flow.steps = data.steps;
  flow.services = {};

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
              const wire = {
                src: endpoint,
                srcPanel: step,
                dstPanel: cs,
                dst: ce
              };
              flow.wires.push(wire);
            }
          }
        }

        m = endpoint.target.match(/^([^\/]+):(.*)/);
        if (m) {
          let cs = servicesById[m[1]];
          if (!cs) {
            const name = m[1];
            cs = servicesById[name] = new Service({
              name: name
            });
          }
          flow.services[cs.name] = cs;

          let ce = cs.endpoints[m[2]];

          if (!ce) {
            const name = m[2];
            ce = cs.endpoints[name] = {
              name: name
            };

            ce.index = cs.leftSide.length;
            cs.leftSide.push({});
          }

          if (ce) {
            const wire = {
              src: endpoint,
              srcPanel: step,
              dstPanel: cs,
              dst: ce
            };
            flow.wires.push(wire);
          }
        }
      }
    }
    step.name = s;
  }

  return flow;
}
