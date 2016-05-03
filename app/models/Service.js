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
      value: config.id || this.name
    });

    Object.defineProperty(this, 'owner', {
      value: owner
    });

    Object.defineProperty(this, 'description', {
      value: config.description
    });

    Object.defineProperty(this, 'type', {
      value: config.type
    });

    Object.defineProperty(this, 'state', {
      value: config.state
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

  setupPanel(wiredPanels) {
    wiredPanels.initializePanel(this);
    this.label.textContent = this.name + (this.type ? ` (${this.type})` : '');

    let l = 0,
      r = 0;

    for (const e in this.endpoints) {
      const endpoint = this.endpoints[e];
      if (endpoint.isIn) {
        if (this.leftSide === undefined || this.leftSide[l] === undefined) {
          console.log(`${this.name} / ${e} ${l} leftSide undefined`);
        } else {
          this.leftSide[l++].label.textContent = endpoint.name;
        }
      }
      if (endpoint.isOut) {
        if (this.rightSide === undefined || this.rightSide[r] === undefined) {
          console.log(`${this.name} / ${e} ${r} rightSide undefined`);
        } else {
          this.rightSide[r++].label.textContent = endpoint.name;
        }
      }
    }
  }

}
