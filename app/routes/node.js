import Ember from 'ember';

import Util from '../models/Util';

export default Ember.Route.extend({
  model(params) {
    return Util.getNode(params.node_id);
  }
});
