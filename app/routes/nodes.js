import Ember from 'ember';
import Util from '../models/Util';

export default Ember.Route.extend({
  model: () => Util.allNodes(),

  deactivate: () => {
    console.log(`nodes deactivate`);
  }
});
