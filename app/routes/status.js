import Ember from 'ember';
import fetch from 'fetch';

export default Ember.Route.extend({
  model: () => fetch('status').then((response) => response.json())
});
