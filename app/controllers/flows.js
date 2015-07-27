import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    "delete": function(flow) {
      console.log(`delete: ${flow.name}`);
    },
    pause: function(flow) {
      console.log(`pause: ${flow.name}`);
    }
  }
});
