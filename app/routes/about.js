import Ember from 'ember';
import fetch from 'fetch';
import Util from '../models/Util';

export default Ember.Route.extend({
  model: params => fetch(`api/${Util.nodeId(params)}/software`).then(response => response.json())
});
