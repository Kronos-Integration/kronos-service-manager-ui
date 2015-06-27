import Ember from 'ember';
import fetch from 'fetch';

export default Ember.Route.extend({
  model: () => fetch('flows').then((response) => response.json())
});
