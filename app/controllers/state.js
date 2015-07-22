import Ember from 'ember';

export default Ember.Controller.extend({

  socketService: Ember.inject.service('websockets'),
  init: function() {
    this._super.apply(this, arguments);

    const location = `ws://${window.location.host}/state`;
    const socket = this.get('socketService').socketFor(location);

    socket.on('message', function(event) {
      const data = JSON.parse(event.data);
      console.log(`uptime: ${data.uptime}`);

      this.set('uptime',data.uptime);
      /*
      this.set('memory.heapTotal',data.memory.heapTotal);
      this.set('memory.heapUsed',data.memory.heapUsed);
      */
    }, this);
    socket.on('close', function(event) {
      console.log('close');
    }, this);
  }
});
