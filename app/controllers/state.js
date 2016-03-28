import Ember from 'ember';

export default Ember.Controller.extend({

  socketService: Ember.inject.service('websockets'),
  xinit() {
    this._super.apply(this, arguments);

    const location = `ws://${window.location.host}/state`;
    let socket = this.get('socketService').socketFor(location);
    let intervalHandler;
    const myself = this;

    socket.on('open', () => {
      console.log(`(Re)open socket ${location}`);
      this.set('content.connected', true);
      clearInterval(intervalHandler);
    }, this);
    socket.on('close', () => {
      socket = undefined;
      this.set('content.connected', false);
      intervalHandler = setInterval(() => {
        socket = this.get('socketService').socketFor(location);
        console.log(`Trying to reopen socket ${location} -> ${socket}`);
      }, 5000);
    }, this);
    socket.on('message', event => {
      const data = JSON.parse(event.data);
      this.set('content.uptime', data.uptime);
      this.set('content.memory.heapTotal', data.memory.heapTotal);
      this.set('content.memory.heapUsed', data.memory.heapUsed);
      this.set('content.memory.rss', data.memory.rss);
    }, this);
  }
});
