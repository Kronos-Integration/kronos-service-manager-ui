import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
	location: config.locationType
});

export default Router.map(function () {
	this.resource('flows', function () {
		this.resource('flow', {
				path: '/:flow_id'
			});
	});
});
