import Service from './Service';

export default class Node extends Service {

  constructor(name, id, tags) {
    super({
      name: name,
      id: id
    });

    const steps = {};
    const services = {};

    tags.forEach(t => {
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
