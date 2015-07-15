import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    drag: function(step) {
      //step.x = 100;
      //step.set('x',step.get('x') + 10);
      console.log(`drag: ${step.name}`);
    }
  }
});
