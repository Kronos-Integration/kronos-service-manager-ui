/*  Promise */

import fetch from 'fetch';
import Service from './Service';
import SendEndpoint from './SendEndpoint';
import ReceiveEndpoint from './ReceiveEndpoint';

const servicesById = {};

export function all() {
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

export function find(id) {
  return all().then(all => all[id]);
}
