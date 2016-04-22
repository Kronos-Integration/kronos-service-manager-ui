import EndpointsMixin from './EndpointsMixin';

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
  }
}
