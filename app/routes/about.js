import Ember from 'ember';
import fetch from 'fetch';
import Nodes from '../models/Nodes';

export default Ember.Route.extend({
  model: params => fetch(`api/${Nodes.nodeId(params)}/software`).then(response => response.json())
});
