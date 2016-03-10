import Ember from 'ember';

import Util from 'kronos-service-manager-ui/models/Util';

export default Ember.Route.extend({
  model(params) {
    return Util.getFlow(params.flow_id);
  }
});
