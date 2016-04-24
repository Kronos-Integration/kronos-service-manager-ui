import EndpointsMixin from './EndpointsMixin';
import SendEndpoint from './SendEndpoint';
import ReceiveEndpoint from './ReceiveEndpoint';

class _Service {}

export default class Service extends EndpointsMixin(_Service) {
  constructor(config, owner) {
    super();

    if (owner === undefined) {
      owner = this;
    }

    Object.defineProperty(this, 'name', {
      value: config.name
    });

    Object.defineProperty(this, 'id', {
      value: this.name
    });

    Object.defineProperty(this, 'owner', {
      value: owner
    });

    for (const en in config.endpoints) {
      const ep = config.endpoints[en];
      let endpoint;

      if (ep.in) {
        endpoint = new ReceiveEndpoint(en, this);
      }
      if (ep.out) {
        endpoint = new SendEndpoint(en, this);
      }

      endpoint.target = ep.target;
      this.addEndpoint(endpoint);
    }
  }

  isRunning() {
    return this.state === 'running';
  }
}
