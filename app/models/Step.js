import EndpointsMixin from './EndpointsMixin';

class _Step {}

export default class Step extends EndpointsMixin(_Step) {
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

  isRunning() {
    return this.state === 'running';
  }
}
