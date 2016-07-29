/*  Promise */

import Ember from 'ember';
import fetch from 'fetch';
import Step from './Step';
import Flow from './Flow';
import Services from './Services';

const flowsById = {};

export function all() {
  if (flowsById.length > 0) {
    return flowsById;
  }

  return fetch('api/localnode/flow').then(response => response.json().then(flowJson =>
    createFlowsFromJSON(flowJson)
  ));
}

export function find(id) {
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
          promises.push(Services.find(sn).then(service => makeServiceEndpoint(en, service)));
        }
      }
    }
  }

  if (promises.length) {
    return Promise.all(promises).then(() => flow);
  }

  return flow;
}
