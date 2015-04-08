import Ember from 'ember';

export default Ember.Route.extend({
	model: function () {
		return [{
			name: "flow1"
		}, {
			name: "flow2"
		}]
	}
});
