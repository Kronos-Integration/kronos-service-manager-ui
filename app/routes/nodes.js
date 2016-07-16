import Ember from 'ember';
import Nodes from '../models/Nodes';

export default Ember.Route.extend({
  model: () => Nodes.all(),

  deactivate: () => {}
});
