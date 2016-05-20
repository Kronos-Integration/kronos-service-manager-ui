import Service from './Service';

export default class Node extends Service {

  constructor(json) {
    super({
      name: json.ServiceName,
      id: json.ServiceID
    });

    for (const att of['Node', 'ServicePort', 'ServiceAddress', 'CreateIndex', 'ModifyIndex']) {
      Object.defineProperty(this, att, {
        value: json[att]
      });
    }

    const steps = {};
    const services = {};

    json.ServiceTags.forEach(t => {
      const m = t.match(/^([^:]+):(.*)/);

      if (m) {
        const name = m[2];

        if (m[1] === 'step') {
          steps[name] = {
            name: name
          };
        }

        if (m[1] === 'service') {
          services[name] = {
            name: name
          };
        }
      }
    });

    Object.defineProperty(this, 'steps', {
      value: steps
    });

    Object.defineProperty(this, 'services', {
      value: services
    });
  }
}
