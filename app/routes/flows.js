import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return [{
      id: "flow1_id",
      name: "flow1",
      description: "description of flow1"
    }, {
      id: "flow2_id",
      name: "flow2",
      description: "description of flow2"
    }];
  }
});
