import Ember from 'ember';
import Configs from '../models/Configs';

export default Ember.Route.extend({
  model: () => Configs.all()
});
