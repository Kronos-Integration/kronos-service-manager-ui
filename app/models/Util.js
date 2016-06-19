/*  Promise */

import Ember from 'ember';
import fetch from 'fetch';
import Step from './Step';
import Flow from './Flow';
import Service from './Service';
import Node from './Node';
import SendEndpoint from './SendEndpoint';
import ReceiveEndpoint from './ReceiveEndpoint';

export function nodeId(params) {
  return params.node_id ? params.node_id : 'localnode';
}

const allNodesArray = [];
const nodesById = {};
const flowsById = {};
const servicesById = {};

export function allNodes() {
  if (nodesById.length > 0) {
    return Promise.resolve(allNodesArray);
  }

  return fetch('api/nodes').then(response => response.json()).then(nodeJson => {
    updateNodes(nodeJson);
    return allNodesArray;
  });
}

export function updateNodes(nodeJson) {
  allNodesArray.length = 0;

  Object.keys(nodesById).forEach(n => {
    delete nodesById[n];
  });

  nodeJson.forEach(s => {
    const node = new Node(s);
    nodesById[node.id] = node;
    allNodesArray.push(node);
  });
}

export function getNode(id) {
  return allNodes().then(all => all[id]);
}

export function allServices() {
  if (servicesById.length > 0) {
    return Promise.resolve(servicesById);
  }

  return fetch('api/localnode/service').then(response => response.json()).then(serviceJson => {
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

  return fetch('api/localnode/flow').then(response => response.json().then(flowJson =>
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

  return fetch(`api/localnode/flow/${id}`).then(response => response.json().then(json => createFromJSON(
    json)));
}

export function createFlowsFromJSON(json) {
  json.forEach(e => {
    const ObjectPromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);

    const flow = ObjectPromiseProxy.create({
      id: e,
      name: e,
      promise: fetch(`api/localnode/flow/${e}`)
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
  const promises = [];

  const flow = new Flow({
    name: data.name,
    description: data.description
  });

  flowsById[flow.id] = flow;

  for (const s in data.steps) {
    const sd = data.steps[s];
    sd.name = s;
    const step = new Step(sd, flow);
    flow.steps[step.name] = step;
  }


  function makeServiceEndpoint(en, service) {
    flow.services[service.name] = service;

    const ce = service.endpoints[en];

    if (ce) {
      /*
      const wire = {
        src: endpoint,
        srcPanel: step,
        dstPanel: service,
        dst: ce
      };
      flow.wires.push(wire);
      */
    } else {
      console.log(`endpoint missing: ${service.name} / ${en}`);
    }

    //console.log(`service: ${service.name}`);
    return Promise.resolve();
  }

  for (const sn in flow.steps) {
    const step = flow.steps[sn];

    for (const e in step.endpoints) {
      const endpoint = step.endpoints[e];

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
          const sn = m[1];
          const en = m[2];
          promises.push(getService(sn).then(service => makeServiceEndpoint(en, service)));
        }
      }
    }
  }

  if (promises.length) {
    return Promise.all(promises).then(() => flow);
  }

  return flow;
}
