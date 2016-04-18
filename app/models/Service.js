import Ember from 'ember';

export default Ember.Object.extend({
  name: "",
  description: "",
  state: 'invalid',
  wires: [],
  endpoints: {},
  leftSide: [],
  rightSide: [],
  isRunning() {
    return this.state === 'running';
  }
});
