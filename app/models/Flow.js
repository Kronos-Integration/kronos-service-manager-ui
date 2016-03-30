import Ember from 'ember';

export default Ember.Object.extend({
  name: "",
  description: "",
  state: 'invalid',
  steps: {},
  links: [],
  isRunning() {
    return this.state === 'running';
  }
});
