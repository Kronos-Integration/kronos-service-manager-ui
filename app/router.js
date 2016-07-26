import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

export default Router.map(function () {

  this.route('configs');

  this.route('nodes');
  this.route('node', {
    path: '/node/:node_id'
  });

  this.route('flows');
  this.route('flow', {
    path: '/flow/:flow_id'
  });

  this.route('services');
  this.route('service', {
    path: '/service/:service_id'
  });

  this.route('login');
  this.route('state');
  this.route('about');
});
