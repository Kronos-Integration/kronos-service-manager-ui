import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    authenticate() {
      const credentials = this.getProperties('identification', 'password'),
        authenticator = 'simple-auth-authenticator:jwt';

      this.get('session').authenticate(authenticator, credentials);
    }
  }
});
