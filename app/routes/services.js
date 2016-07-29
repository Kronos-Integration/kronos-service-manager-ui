import Ember from 'ember';
import Services from '../models/Services';

export default Ember.Route.extend({
  model: () => Services.all()
});
