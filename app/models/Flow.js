import Step from './Step';

export default class Flow extends Step {
  constructor(config, owner) {
    super(config, owner);

    this.steps = {};
    this.services = {};
    this.wires = [];
  }
}
