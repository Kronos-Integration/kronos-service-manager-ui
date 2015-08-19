import Ember from 'ember';

export default Ember.Controller.extend({

  socketService: Ember.inject.service('websockets'),
  init: function () {
    this._super.apply(this, arguments);

    const location = `ws://${window.location.host}/state`;
    const socket = this.get('socketService').socketFor(location);

    socket.on('open', function() {
      this.set('content.connected',true);
      }, this);
    socket.on('close', function () {
      this.set('content.connected',false);
      }, this);
    socket.on('message', function (event) {
      const data = JSON.parse(event.data);
      this.set('content.uptime', data.uptime);
      this.set('content.memory.heapTotal',data.memory.heapTotal);
      this.set('content.memory.heapUsed',data.memory.heapUsed);
      this.set('content.memory.rss',data.memory.rss);
    }, this);
  }
});
