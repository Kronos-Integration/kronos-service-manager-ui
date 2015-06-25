import Ember from 'ember';
import fetch from 'fetch';

export default Ember.Route.extend({
  model: function () {
    return fetch('/flows').then(function (response) {
      return response.json().then(function (data) {
        //console.log(JSON.stringify(data));

        const flows = data.map(function (f) {
          return {
            id: f,
            name: f,
            description: `description ${f}`
          };
        });

        //console.log(JSON.stringify(flows));

        return flows;
      });
    });

    /*
        return [{
          id: "flow1_id",
          name: "flow1",
          description: "description of flow1"
        }, {
          id: "flow2_id",
          name: "flow2",
          description: "description of flow2"
        }];
        */
  }
});
