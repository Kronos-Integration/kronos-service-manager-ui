import Ember from 'ember';
import fetch from 'fetch';

export default Ember.Route.extend({
  model: () => fetch('state').then((response) => response.json())
});
