import Ember from 'ember';
import Nodes from '../models/Nodes';

export default Ember.Route.extend({
  model: params => Nodes.find(params.node_id)
});
