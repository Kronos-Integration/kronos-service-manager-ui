import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    authenticate: function() {
      const credentials = this.getProperties('identification', 'password'),
        authenticator = 'simple-auth-authenticator:jwt';

      this.get('session').authenticate(authenticator, credentials);
    }
  }
});
