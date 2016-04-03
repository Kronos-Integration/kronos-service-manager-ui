import Ember from 'ember';
import fetch from 'fetch';

export default Ember.Route.extend({
  model: () => fetch('api/software').then(response => response.json())
});
