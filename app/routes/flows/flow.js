import Ember from 'ember';

export default Ember.Route.extend({
  model: function (id) {

    console.log(`fetch: ${id}`);
    return {
      id: "flow3_id",
      name: "flow3",
      description: "description of flow3"
    };
  }
});
