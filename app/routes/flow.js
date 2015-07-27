import Ember from 'ember';
import fetch from 'fetch';

import Util from 'kronos-service-manager-ui/models/Util';

export default Ember.Route.extend({
  model: function (params) {
    return fetch(`flows/${params.flow_id}`).then((response) => response.json().then((json) => Util.createFromJSON(
      json)));
  }
});
