import Ember from 'ember';

export default Ember.Controller.extend({

  socketService: Ember.inject.service('websockets'),
  init: function () {
    this._super.apply(this, arguments);

    const location = `ws://${window.location.host}/state`;
    let socket = this.get('socketService').socketFor(location);
    let intervalHandler;
    const myself = this;

    socket.on('open', function() {
      console.log(`(Re)open socket ${location}`);
      this.set('content.connected',true);
      clearInterval(intervalHandler);
      }, this);
    socket.on('close', function () {
      socket = undefined;
      this.set('content.connected',false);
      intervalHandler = setInterval(function() {
        socket = myself.get('socketService').socketFor(location);
        console.log(`Trying to reopen socket ${location} -> ${socket}`);
        }, 5000);
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
