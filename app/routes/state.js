import Ember from 'ember';
import fetch from 'fetch';
import Util from '../models/Util';

export default Ember.Route.extend({
  model: params => fetch(`api/${Util.nodeId(params)}/state`).then(response => response.json()),

  deactivate: () => {
    //this.controller.willDestroyElement();
    console.log(`state deactivate`);
  }
});
