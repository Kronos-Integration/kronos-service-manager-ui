import Ember from 'ember';
import Flows from '../models/Flows';

export default Ember.Route.extend({
  model: () => Flows.all()
});
