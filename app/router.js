import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function () {
  this.route('flows');
  this.route('flow', {
    path: '/flows/:flow_id'
  });

  this.route('login');
  this.route('state');
  this.route('about');
});
