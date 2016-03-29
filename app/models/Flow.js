import Ember from 'ember';

export default Ember.Object.extend({
  name: "",
  description: "",
  state: "stopped",
  steps: {},
  isRunning() {
    return this.state === 'running';
  }
});
