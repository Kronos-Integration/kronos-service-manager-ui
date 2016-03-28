import Ember from 'ember';

export default Ember.Object.extend({
  name: "",
  description: "",
  state: "registered",
  steps: undefined,
  isRunning() {
    return this.state === 'running';
  }
});
