import Ember from 'ember';
import fetch from 'fetch';
import Nodes from '../models/Nodes';

export default Ember.Route.extend({
  model: params => fetch(`api/${Nodes.nodeId(params)}/state`).then(response => response.json()),

  deactivate: () => {
    //this.controller.willDestroyElement();
  }
});
