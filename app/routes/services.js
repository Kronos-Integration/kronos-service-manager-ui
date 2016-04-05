import Ember from 'ember';
import Util from '../models/Util';

export default Ember.Route.extend({
  model() {
    return Util.allServices();
  }
});
